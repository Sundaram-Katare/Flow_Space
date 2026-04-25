import { useState } from "react";
import { updateTask } from "../../services/tasks.js";
import { useDispatch } from "react-redux";
import { updateTask as updateTaskAction } from "../../../features/task/taskSlice.js";

export default function TaskCard({ task, onDragStart, onDelete, workspaceId }) {
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || "");
  const [editedPriority, setEditedPriority] = useState(task.priority || "medium");

  const handleSaveEdit = async () => {
    try {
      const data = await updateTask(task.id, workspaceId, {
        title: editedTitle,
        description: editedDescription,
        priority: editedPriority,
      });
      dispatch(updateTaskAction(data.task));
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update task");
    }
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };

  return (
    <>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, task)}
        onClick={() => setShowDetails(true)}
        className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-lg p-3 cursor-move hover:shadow-lg hover:scale-105 transition-all"
      >
        <h4 className="font-semibold text-gray-900 text-sm mb-2 truncate">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-1 rounded-full font-semibold ${
              priorityColors[task.priority] || priorityColors.medium
            }`}
          >
            {task.priority?.toUpperCase()}
          </span>

          {task.assigned_username && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {task.assigned_username}
            </span>
          )}
        </div>
      </div>

      {/* Task Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">Task Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-2xl hover:opacity-70"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Description
                    </label>
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Priority
                    </label>
                    <select
                      value={editedPriority}
                      onChange={(e) => setEditedPriority(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-gray-600">{task.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">
                        PRIORITY
                      </p>
                      <p
                        className={`text-sm font-bold mt-1 ${
                          priorityColors[task.priority]
                        }`}
                      >
                        {task.priority?.toUpperCase()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 font-semibold">
                        STATUS
                      </p>
                      <p className="text-sm font-bold mt-1 text-blue-600">
                        {task.status?.toUpperCase().replace("_", " ")}
                      </p>
                    </div>

                    {task.assigned_username && (
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">
                          ASSIGNED TO
                        </p>
                        <p className="text-sm font-bold mt-1 text-gray-900">
                          {task.assigned_username}
                        </p>
                      </div>
                    )}

                    {task.created_username && (
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">
                          CREATED BY
                        </p>
                        <p className="text-sm font-bold mt-1 text-gray-900">
                          {task.created_username}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowDetails(false);
                        onDelete(task.id);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}