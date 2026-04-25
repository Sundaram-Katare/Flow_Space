import {
  createDoc,
  getWorkspaceDocs,
  getDocById,
  updateDoc,
  deleteDoc,
} from "../Tables/docs.js";
import { getMemberRole } from "../Tables/workspace_members.js";
import * as cache from "../services/cache.js";

export const createDocController = async (req, res) => {
  try {
    const userId = req.userId;
    const { workspaceId } = req.params;
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Document title required" });
    }

    // Check if user is workspace member
    // const role = await getMemberRole(workspaceId, userId);
    // if (!role) {
    //   return res.status(403).json({ error: "Not a member of this workspace" });
    // }

    // Create document
    // Default content structure if not provided
    const defaultContent = content || {
      blocks: [
        { id: "1", type: "heading", level: 1, text: title },
        { id: "2", type: "paragraph", text: "" },
      ],
    };

    const doc = await createDoc(workspaceId, title, userId, defaultContent);

    // Invalidate cache
    await cache.del(`docs:${workspaceId}`);

    // Broadcast to all users in workspace
    const io = req.app.get("io");
    io.to(`workspace:${workspaceId}`).emit("doc-created", {
      id: doc.id,
      title: doc.title,
      created_by: doc.created_by,
      created_at: doc.created_at,
    });

    res.status(201).json({
      message: "Document created successfully",
      doc: {
        id: doc.id,
        title: doc.title,
        workspace_id: doc.workspace_id,
        created_by: doc.created_by,
        created_at: doc.created_at,
      },
    });
  } catch (err) {
    console.error("Create doc error:", err);
    res.status(500).json({ error: "Failed to create document" });
  }
};

// GET ALL DOCUMENTS IN WORKSPACE
export const getWorkspaceDocsController = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Try cache
    const cacheKey = `docs:${workspaceId}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json({ docs: cached });
    }

    // Query database
    const docs = await getWorkspaceDocs(workspaceId);

    // Cache for 1 hour
    await cache.set(cacheKey, docs, 3600);

    res.json({ docs });
  } catch (err) {
    console.error("Get docs error:", err);
    res.status(500).json({ error: "Failed to get documents" });
  }
};

// GET SINGLE DOCUMENT WITH CONTENT
export const getDocController = async (req, res) => {
  try {
    const { docId } = req.params;
    const userId = req.userId;

    // Get document
    const doc = await getDocById(docId);

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Check if user is member of workspace
    const role = await getMemberRole(doc.workspace_id, userId);
    if (!role) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({
      doc: {
        id: doc.id,
        title: doc.title,
        workspace_id: doc.workspace_id,
        content: typeof doc.content === "string" ? JSON.parse(doc.content) : doc.content,
        created_by: doc.created_by,
        username: doc.username,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
      },
    });
  } catch (err) {
    console.error("Get doc error:", err);
    res.status(500).json({ error: "Failed to get document" });
  }
};

// UPDATE DOCUMENT (content & title)
export const updateDocController = async (req, res) => {
  try {
    const { docId, workspaceId } = req.params;
    const userId = req.userId;
    const { title, content } = req.body;

    // Check membership
    const role = await getMemberRole(workspaceId, userId);
    if (!role) {
      return res.status(403).json({ error: "Not a member of this workspace" });
    }

    // Update document
    const doc = await updateDoc(
      docId,
      title,
      typeof content === "string" ? JSON.parse(content) : content
    );

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Invalidate cache
    await cache.del(`docs:${workspaceId}`);

    // Broadcast update to all users viewing this doc
    const io = req.app.get("io");
    io.to(`doc:${docId}`).emit("doc-updated", {
      docId: doc.id,
      title: doc.title,
      content: typeof doc.content === "string" ? JSON.parse(doc.content) : doc.content,
      updated_at: doc.updated_at,
      updated_by: userId,
    });

    res.json({
      message: "Document updated successfully",
      doc: {
        id: doc.id,
        title: doc.title,
        content: typeof doc.content === "string" ? JSON.parse(doc.content) : doc.content,
        updated_at: doc.updated_at,
      },
    });
  } catch (err) {
    console.error("Update doc error:", err);
    res.status(500).json({ error: "Failed to update document" });
  }
};

// UPDATE DOCUMENT BLOCK (real-time editing)
export const updateDocBlockController = async (req, res) => {
  try {
    const { docId, workspaceId } = req.params;
    const userId = req.userId;
    const { blockId, blockData } = req.body;

    // Check membership
    const role = await getMemberRole(workspaceId, userId);
    if (!role) {
      return res.status(403).json({ error: "Not a member of this workspace" });
    }

    // Get current document
    const doc = await getDocById(docId);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Parse content
    let content = typeof doc.content === "string" ? JSON.parse(doc.content) : doc.content;

    // Update block
    const blockIndex = content.blocks.findIndex((b) => b.id === blockId);
    if (blockIndex === -1) {
      return res.status(404).json({ error: "Block not found" });
    }

    content.blocks[blockIndex] = { ...content.blocks[blockIndex], ...blockData };

    // Save to database
    await updateDoc(docId, doc.title, content);

    // Broadcast to all users viewing this doc (real-time)
    const io = req.app.get("io");
    io.to(`doc:${docId}`).emit("doc-block-updated", {
      docId,
      blockId,
      blockData: content.blocks[blockIndex],
      updated_by: userId,
    });

    res.json({
      message: "Block updated",
      block: content.blocks[blockIndex],
    });
  } catch (err) {
    console.error("Update block error:", err);
    res.status(500).json({ error: "Failed to update block" });
  }
};

// ADD NEW BLOCK TO DOCUMENT
export const addBlockController = async (req, res) => {
  try {
    const { docId, workspaceId } = req.params;
    const userId = req.userId;
    const { blockType, afterBlockId } = req.body;

    // Check membership
    const role = await getMemberRole(workspaceId, userId);
    if (!role) {
      return res.status(403).json({ error: "Not a member of this workspace" });
    }

    // Get current document
    const doc = await getDocById(docId);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Parse content
    let content = typeof doc.content === "string" ? JSON.parse(doc.content) : doc.content;

    // Generate new block ID
    const newBlockId = Math.random().toString(36).substr(2, 9);

    // Create new block
    const newBlock = {
      id: newBlockId,
      type: blockType || "paragraph",
      text: "",
      ...(blockType === "heading" && { level: 2 }),
    };

    // Find insert position
    if (afterBlockId) {
      const index = content.blocks.findIndex((b) => b.id === afterBlockId);
      if (index !== -1) {
        content.blocks.splice(index + 1, 0, newBlock);
      } else {
        content.blocks.push(newBlock);
      }
    } else {
      content.blocks.push(newBlock);
    }

    // Save to database
    await updateDoc(docId, doc.title, content);

    // Broadcast to all users
    const io = req.app.get("io");
    io.to(`doc:${docId}`).emit("doc-block-added", {
      docId,
      block: newBlock,
      afterBlockId,
      added_by: userId,
    });

    res.status(201).json({
      message: "Block added",
      block: newBlock,
    });
  } catch (err) {
    console.error("Add block error:", err);
    res.status(500).json({ error: "Failed to add block" });
  }
};

// DELETE BLOCK FROM DOCUMENT
export const deleteBlockController = async (req, res) => {
  try {
    const { docId, blockId, workspaceId } = req.params;
    const userId = req.userId;

    // Check membership
    const role = await getMemberRole(workspaceId, userId);
    if (!role) {
      return res.status(403).json({ error: "Not a member of this workspace" });
    }

    // Get current document
    const doc = await getDocById(docId);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Parse content
    let content = typeof doc.content === "string" ? JSON.parse(doc.content) : doc.content;

    // Remove block
    content.blocks = content.blocks.filter((b) => b.id !== blockId);

    // Must have at least one block
    if (content.blocks.length === 0) {
      return res.status(400).json({ error: "Document must have at least one block" });
    }

    // Save to database
    await updateDoc(docId, doc.title, content);

    // Broadcast to all users
    const io = req.app.get("io");
    io.to(`doc:${docId}`).emit("doc-block-deleted", {
      docId,
      blockId,
      deleted_by: userId,
    });

    res.json({ message: "Block deleted" });
  } catch (err) {
    console.error("Delete block error:", err);
    res.status(500).json({ error: "Failed to delete block" });
  }
};

// DELETE DOCUMENT
export const deleteDocController = async (req, res) => {
  try {
    const { docId, workspaceId } = req.params;
    const userId = req.userId;

    // Check if user is admin
    const role = await getMemberRole(workspaceId, userId);
    if (role !== "admin") {
      return res.status(403).json({ error: "Only admins can delete documents" });
    }

    // Delete document
    await deleteDoc(docId);

    // Invalidate cache
    await cache.del(`docs:${workspaceId}`);

    // Broadcast deletion
    const io = req.app.get("io");
    io.to(`workspace:${workspaceId}`).emit("doc-deleted", { docId });

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Delete doc error:", err);
    res.status(500).json({ error: "Failed to delete document" });
  }
};