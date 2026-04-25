import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateBlock,
  addBlock,
  deleteBlock,
  updateDocTitle,
  addActiveUser,
  removeActiveUser,
  setTypingUser,
  removeTypingUser,
} from "../../../features/docs/docSlice.js";
import {
  updateDocBlock,
  addDocBlock,
  deleteDocBlock,
  updateDoc,
} from "../../services/docs.js";
import {
  openDoc,
  closeDoc,
  docTyping,
  docStopTyping,
  onDocBlockUpdated,
  onDocBlockAdded,
  onDocBlockDeleted,
  onDocUserJoined,
  onDocUserLeft,
  onUserDocTyping,
  onUserDocStopTyping,
} from "../../services/socket.js";
import { 
  Plus, 
  Trash2, 
  Type, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  GripVertical,
  CheckCircle2,
  Clock,
  User as UserIcon,
  File
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DocEditor({ docId, workspaceId }) {
  const dispatch = useDispatch();
  const { currentDoc, activeUsers, typingUsers } = useSelector(
    (state) => state.docs
  );
  const [title, setTitle] = useState(currentDoc?.title || "Untitled");
  const [isSaving, setIsSaving] = useState(false);
  const typingTimeoutRef = useRef({});

  // Sync internal title with Redux title when doc changes
  useEffect(() => {
    if (currentDoc?.title) {
      setTitle(currentDoc.title);
    }
  }, [currentDoc?.id]);

  // Open doc on mount
  useEffect(() => {
    openDoc(docId);
    return () => closeDoc(docId);
  }, [docId]);

  // Real-time listeners
  useEffect(() => {
    const unsubBlockUpdated = onDocBlockUpdated((data) => {
      dispatch(updateBlock({ blockId: data.blockId, blockData: data.blockData }));
    });

    const unsubBlockAdded = onDocBlockAdded((data) => {
      dispatch(addBlock({ block: data.block, afterBlockId: data.afterBlockId }));
    });

    const unsubBlockDeleted = onDocBlockDeleted((data) => {
      dispatch(deleteBlock(data.blockId));
    });

    const unsubUserJoined = onDocUserJoined((data) => {
      dispatch(addActiveUser({ userId: data.userId, username: data.username }));
    });

    const unsubUserLeft = onDocUserLeft((data) => {
      dispatch(removeActiveUser(data.userId));
    });

    const unsubTyping = onUserDocTyping((data) => {
      dispatch(setTypingUser({ userId: data.userId, blockId: data.blockId, position: data.position }));
    });

    const unsubStopTyping = onUserDocStopTyping((data) => {
      dispatch(removeTypingUser(data.userId));
    });

    return () => {
      if (unsubBlockUpdated) unsubBlockUpdated();
      if (unsubBlockAdded) unsubBlockAdded();
      if (unsubBlockDeleted) unsubBlockDeleted();
      if (unsubUserJoined) unsubUserJoined();
      if (unsubUserLeft) unsubUserLeft();
      if (unsubTyping) unsubTyping();
      if (unsubStopTyping) unsubStopTyping();
    };
  }, [dispatch]);

  const handleTitleChange = async (newTitle) => {
    setTitle(newTitle);
    dispatch(updateDocTitle({ docId, title: newTitle }));

    setIsSaving(true);
    try {
      await updateDoc(docId, workspaceId, newTitle, currentDoc.content);
    } catch (err) {
      console.error("Failed to update title:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlockChange = async (blockId, newText) => {
    dispatch(updateBlock({ blockId, blockData: { text: newText } }));

    // Clear existing timeout
    if (typingTimeoutRef.current[blockId]) {
      clearTimeout(typingTimeoutRef.current[blockId]);
    }

    // Send typing indicator
    docTyping(docId, blockId, newText.length);

    // Debounce save (500ms)
    typingTimeoutRef.current[blockId] = setTimeout(async () => {
      try {
        await updateDocBlock(docId, workspaceId, blockId, { text: newText });
        docStopTyping(docId);
      } catch (err) {
        console.error("Failed to save block:", err);
      }
    }, 500);
  };

  const handleAddBlock = async (blockType, afterBlockId) => {
    try {
      const data = await addDocBlock(docId, workspaceId, blockType, afterBlockId);
      dispatch(addBlock({ block: data.block, afterBlockId }));
    } catch (err) {
      console.error("Failed to add block:", err);
    }
  };

  const handleDeleteBlock = async (blockId) => {
    if (currentDoc.content?.blocks?.length <= 1) return; // Don't delete last block

    try {
      await deleteDocBlock(docId, workspaceId, blockId);
      dispatch(deleteBlock(blockId));
    } catch (err) {
      console.error("Failed to delete block:", err);
    }
  };

  if (!currentDoc) {
    return (
      <div className="h-full flex items-center justify-center">
        <Clock className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <File size={20} />
          </div>
          <div className="flex-1 max-w-2xl">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full text-xl font-bold text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-300"
              placeholder="Document Title"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isSaving ? (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Clock size={12} className="animate-spin" />
              Saving...
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium text-teal-600">
              <CheckCircle2 size={12} />
              Saved
            </div>
          )}

          <div className="h-6 w-[1px] bg-slate-100 mx-2" />

          {/* Active Users Avatars */}
          <div className="flex -space-x-2">
            {activeUsers.slice(0, 3).map((user, idx) => (
              <div 
                key={user.userId}
                title={user.username}
                className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
                style={{ backgroundColor: `hsl(${(idx * 137) % 360}, 60%, 50%)` }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
            ))}
            {activeUsers.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm">
                +{activeUsers.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-12 py-16 space-y-4">
          <AnimatePresence initial={false}>
            {currentDoc.content?.blocks?.map((block, index) => (
              <EditorBlock
                key={block.id}
                block={block}
                onChange={(text) => handleBlockChange(block.id, text)}
                onAddBlock={(type) => handleAddBlock(type, block.id)}
                onDelete={() => handleDeleteBlock(block.id)}
                isTyping={
                  Object.values(typingUsers).some(u => u.blockId === block.id)
                }
              />
            ))}
          </AnimatePresence>

          <div className="pt-8 flex justify-center">
             <button 
                onClick={() => handleAddBlock("paragraph", currentDoc.content.blocks[currentDoc.content.blocks.length - 1]?.id)}
                className="group flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
              >
                <Plus size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Add a block</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditorBlock({
  block,
  onChange,
  onAddBlock,
  onDelete,
  isTyping,
}) {
  const [showControls, setShowControls] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [block.text]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onAddBlock("paragraph");
    }

    if (e.key === "Backspace" && block.text === "") {
      e.preventDefault();
      onDelete();
    }
  };

  const getBlockStyles = () => {
    const base = "w-full bg-transparent resize-none overflow-hidden focus:outline-none transition-all duration-200 ";
    
    switch(block.type) {
      case "heading":
        const levels = {
          1: "text-4xl font-extrabold text-slate-900 tracking-tight mb-4 mt-8",
          2: "text-2xl font-bold text-slate-800 mb-2 mt-6",
          3: "text-xl font-semibold text-slate-700 mb-1 mt-4"
        };
        return base + (levels[block.level] || levels[2]);
      case "list":
        return base + "text-base text-slate-600 leading-relaxed border-l-2 border-slate-100 pl-4";
      default:
        return base + "text-base text-slate-600 leading-relaxed";
    }
  };

  const BlockIcon = () => {
    if (block.type === "heading") {
      if (block.level === 1) return <Heading1 size={14} />;
      if (block.level === 2) return <Heading2 size={14} />;
      return <Heading3 size={14} />;
    }
    if (block.type === "list") return <List size={14} />;
    return <Type size={14} />;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      className="group relative flex items-start gap-4"
    >
      {/* Side Controls */}
      <div className={`flex items-center gap-1 transition-opacity duration-200 mt-1.5 ${showControls ? "opacity-100" : "opacity-0"}`}>
        <button 
          className="p-1 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded cursor-grab active:cursor-grabbing"
          title="Drag to reorder (Coming soon)"
        >
          <GripVertical size={14} />
        </button>
        <button 
          onClick={() => onAddBlock(block.type === 'heading' ? 'paragraph' : 'heading')}
          className="p-1 text-slate-300 hover:text-teal-600 hover:bg-teal-50 rounded"
          title="Change type / Add block"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Block Icon / Type Indicator */}
      <div className={`mt-2.5 w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors ${
        showControls ? "bg-slate-100 text-slate-500" : "text-slate-200"
      }`}>
        <BlockIcon />
      </div>

      {/* Textarea */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={block.text}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={block.type === 'heading' ? 'Heading...' : 'Type something...'}
          className={getBlockStyles()}
          rows={1}
        />
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -bottom-4 left-0 text-[10px] text-teal-500 font-medium italic"
          >
            Someone is typing...
          </motion.div>
        )}
      </div>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className={`mt-1.5 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
}