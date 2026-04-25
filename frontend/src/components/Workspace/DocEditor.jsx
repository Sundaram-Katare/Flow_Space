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

export default function DocEditor({ docId, workspaceId }) {
  const dispatch = useDispatch();
  const { currentDoc, activeUsers, typingUsers } = useSelector(
    (state) => state.docs
  );
  const [title, setTitle] = useState(currentDoc?.title || "Untitled");
  const [isSaving, setIsSaving] = useState(false);
  const typingTimeoutRef = useRef({});

  // Open doc on mount
  useEffect(() => {
    openDoc(docId);

    return () => {
      closeDoc(docId);
    };
  }, [docId]);

  // Real-time listeners
  useEffect(() => {
    onDocBlockUpdated((data) => {
      dispatch(updateBlock({ blockId: data.blockId, blockData: data.blockData }));
    });

    onDocBlockAdded((data) => {
      dispatch(addBlock({ block: data.block, afterBlockId: data.afterBlockId }));
    });

    onDocBlockDeleted((data) => {
      dispatch(deleteBlock(data.blockId));
    });

    onDocUserJoined((data) => {
      dispatch(addActiveUser({ userId: data.userId, username: data.username }));
    });

    onDocUserLeft((data) => {
      dispatch(removeActiveUser(data.userId));
    });

    onUserDocTyping((data) => {
      dispatch(setTypingUser({ userId: data.userId, blockId: data.blockId, position: data.position }));
    });

    onUserDocStopTyping((data) => {
      dispatch(removeTypingUser(data.userId));
    });

    return () => {
      // Cleanup
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

    // Debounce save (300ms)
    typingTimeoutRef.current[blockId] = setTimeout(async () => {
      try {
        await updateDocBlock(docId, workspaceId, blockId, { text: newText });
        docStopTyping(docId);
      } catch (err) {
        console.error("Failed to save block:", err);
      }
    }, 300);
  };

  const handleAddBlock = async (blockType, afterBlockId) => {
    try {
      const data = await addDocBlock(docId, workspaceId, blockType, afterBlockId);
      dispatch(addBlock({ block: data.block, afterBlockId }));
    } catch (err) {
      console.error("Failed to add block:", err);
      alert("Failed to add block");
    }
  };

  const handleDeleteBlock = async (blockId) => {
    if (!window.confirm("Delete this block?")) return;

    try {
      await deleteDocBlock(docId, workspaceId, blockId);
      dispatch(deleteBlock(blockId));
    } catch (err) {
      console.error("Failed to delete block:", err);
      alert("Failed to delete block");
    }
  };

  if (!currentDoc) {
    return <div className="p-8 text-center">Loading document...</div>;
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header with title and active users */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-3xl font-bold bg-transparent focus:outline-none flex-1"
            placeholder="Untitled"
          />
          {isSaving && <span className="text-sm text-gray-500">Saving...</span>}
        </div>

        {/* Active users */}
        {activeUsers.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Editing:</span>
            <div className="flex gap-2">
              {activeUsers.map((user) => (
                <span
                  key={user.userId}
                  className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {user.username}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto space-y-2">
          {currentDoc.content?.blocks?.map((block, index) => (
            <EditorBlock
              key={block.id}
              block={block}
              onChange={(text) => handleBlockChange(block.id, text)}
              onAddBlock={(type) => handleAddBlock(type, block.id)}
              onDelete={() => handleDeleteBlock(block.id)}
              isLast={index === currentDoc.content.blocks.length - 1}
              isTyping={
                typingUsers[Object.keys(typingUsers)[0]]?.blockId === block.id
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Individual block editor component
function EditorBlock({
  block,
  onChange,
  onAddBlock,
  onDelete,
  isLast,
  isTyping,
}) {
  const handleKeyDown = (e) => {
    // Enter key: create new block
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onAddBlock("paragraph");
    }

    // Backspace on empty block: delete
    if (e.key === "Backspace" && block.text === "") {
      e.preventDefault();
      onDelete();
    }
  };

  const getBlockClass = () => {
    const baseClass = "w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1 rounded";

    if (block.type === "heading") {
      const sizes = { 1: "text-4xl", 2: "text-3xl", 3: "text-2xl" };
      return `${baseClass} ${sizes[block.level] || "text-2xl"} font-bold`;
    }

    if (block.type === "list") {
      return `${baseClass} text-base`;
    }

    return `${baseClass} text-base`;
  };

  return (
    <div className="relative group">
      <div className="flex gap-2">
        {/* Block type indicator */}
        <div className="w-8 flex items-center justify-center">
          {block.type === "heading" && "📌"}
          {block.type === "paragraph" && "📝"}
          {block.type === "list" && "📋"}
        </div>

        {/* Text input */}
        <textarea
          value={block.text}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Type ${block.type}...`}
          className={getBlockClass()}
          rows={Math.max(1, block.text.split("\n").length)}
        />

        {/* Delete button (hover) */}
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 px-2 py-1 text-red-600 hover:bg-red-50 rounded transition"
        >
          ✕
        </button>
      </div>

      {/* Typing indicator */}
      {isTyping && (
        <div className="text-xs text-gray-400 mt-1">Someone is typing...</div>
      )}
    </div>
  );
}