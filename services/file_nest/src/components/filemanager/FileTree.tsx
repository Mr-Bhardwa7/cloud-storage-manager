import React, { useState, useRef, useEffect } from 'react';
import { Tree, NodeRendererProps, TreeApi, RenameHandler } from 'react-arborist';
import { FiFolder, FiFile, FiFolderPlus, FiTrash2, FiEdit, FiChevronRight, FiChevronDown, FiSearch, FiX } from 'react-icons/fi';

export type FileNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  size?: number;
  modified?: string;
  path: string;
};

interface FileTreeProps {
  data: FileNode[];
  onNodeSelect: (node: FileNode) => void;
  onCreateFolder: (parentPath: string) => void;
  onDeleteItem: (path: string, type: 'file' | 'folder') => void;
  onRenameItem: (path: string, newName: string, type: 'file' | 'folder') => void;
  onMoveNode?: (dragIds: string[], parentId: string | null) => void;
}

export default function FileTree({ 
  data, 
  onNodeSelect, 
  onCreateFolder, 
  onDeleteItem, 
  onRenameItem,
  onMoveNode
}: FileTreeProps) {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    node: FileNode | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  });
  
  // Use useRef instead of useState for the TreeApi
  const treeApiRef = useRef<TreeApi<FileNode>>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<FileNode[]>(data);
  // Remove this line
  // const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  
  // Update the search effect to remove expandedNodes references
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
      return;
    }
  
    const term = searchTerm.toLowerCase();
    
    const searchNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.reduce<FileNode[]>((result, node) => {
        const nameMatch = node.name.toLowerCase().includes(term);
        const childMatches = node.children ? searchNodes(node.children) : [];
        
        if (nameMatch || childMatches.length > 0) {
          const newNode = { ...node };
          if (childMatches.length > 0) {
            newNode.children = childMatches;
          }
          // Remove the expandedNodes setting code
          result.push(newNode);
        }
        
        return result;
      }, []);
    };
    
    setFilteredData(searchNodes(data));
  }, [searchTerm, data]);

  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      node,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false, node: null });
  };

  // Add closeContextMenu to dependency array
  React.useEffect(() => {
    const handleClickOutside = () => closeContextMenu();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [closeContextMenu]);

  // Add this interface near the top of the file, after other interfaces
  interface DropResult {
    dragIds: string[];
    parentId: string | null;
  }

  const handleDrop = (nodes: DropResult) => {
    if (onMoveNode && nodes.dragIds.length > 0) {
      onMoveNode(nodes.dragIds, nodes.parentId);
    }
  };

  const handleRename: RenameHandler<FileNode> = (node) => {
    if (node && node.node.data) {
      onRenameItem(node.node.data.path, node.name, node.node.data.type);
    }
  };

  const NodeRenderer = ({ node, style, dragHandle }: NodeRendererProps<FileNode>) => {
    const { data: nodeData } = node;
    const isFolder = nodeData.type === 'folder';
    
    return (
      <div
        style={style}
        ref={dragHandle}
        className={`flex items-center py-1 px-2 rounded-md cursor-pointer hover:bg-[#2a2d2e] ${
          node.isSelected ? 'bg-[#04395e] text-white' : ''
        }`}
        onClick={() => onNodeSelect(nodeData)}
        onContextMenu={(e) => handleContextMenu(e, nodeData)}
      >
        <div className="mr-1 text-[#bbbbbb]">
          {isFolder ? (
            <div className="flex items-center">
              {node.isOpen ? (
                <FiChevronDown 
                  className={`w-3 h-3 mr-1 ${node.isSelected ? 'text-white' : 'text-[#bbbbbb]'}`} 
                  onClick={(e) => {
                    e.stopPropagation();
                    node.toggle();
                  }}
                />
              ) : (
                <FiChevronRight 
                  className={`w-3 h-3 mr-1 ${node.isSelected ? 'text-white' : 'text-[#bbbbbb]'}`} 
                  onClick={(e) => {
                    e.stopPropagation();
                    node.toggle();
                  }}
                />
              )}
              <FiFolder className={`w-4 h-4 ${node.isSelected ? 'text-white' : 'text-[#dcb67a]'}`} />
            </div>
          ) : (
            <div className="ml-4">
              <FiFile className={`w-4 h-4 ${node.isSelected ? 'text-white' : 'text-[#75beff]'}`} />
            </div>
          )}
        </div>
        <div className="text-sm truncate ml-1">
          {searchTerm && nodeData.name.toLowerCase().includes(searchTerm.toLowerCase()) ? (
            highlightSearchTerm(nodeData.name, searchTerm)
          ) : (
            nodeData.name
          )}
        </div>
        {nodeData.size && !isFolder && (
          <div className="ml-auto text-xs text-[#bbbbbb]">
            {formatFileSize(nodeData.size)}
          </div>
        )}
      </div>
    );
  };

  // Helper function to highlight search term in text
  const highlightSearchTerm = (text: string, term: string) => {
    if (!term) return text;
    
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === term.toLowerCase() ? 
            <span key={i} className="bg-yellow-500/30 text-white font-medium">{part}</span> : 
            part
        )}
      </>
    );
  };

  // Helper function to format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  return (
    <div className="h-full flex flex-col relative" onClick={closeContextMenu}>
      {/* Search bar */}
      <div className="p-2 border-b border-[#1e1e1e]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#3c3c3c] text-[#cccccc] border-none rounded px-2 py-1.5 pl-8 text-sm focus:outline-none focus:ring-1 focus:ring-[#0e639c]"
          />
          <FiSearch className="absolute left-2.5 top-2 text-[#bbbbbb] w-4 h-4" />
          {searchTerm && (
            <button
              className="absolute right-2 top-1.5 text-[#bbbbbb] hover:text-white"
              onClick={() => setSearchTerm('')}
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tree view */}
      <div className="flex-1 overflow-auto">
        <Tree
          ref={treeApiRef}
          data={filteredData}
          openByDefault={searchTerm.length > 0} 
          width="100%"
          height={400}
          indent={16}
          rowHeight={28}
          paddingTop={8}
          paddingBottom={8}
          selectionFollowsFocus={true}
          onRename={handleRename}
          onMove={handleDrop}
          className="file-tree"
        >
          {NodeRenderer}
        </Tree>
      </div>

      {/* Context menu */}
      {contextMenu.visible && contextMenu.node && (
        <div
          className="absolute bg-[#252526] border border-[#3c3c3c] shadow-lg rounded-md py-1 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {contextMenu.node.type === 'folder' && (
            <button
              className="w-full text-left px-4 py-1.5 hover:bg-[#04395e] flex items-center"
              onClick={() => {
                onCreateFolder(contextMenu.node!.path);
                closeContextMenu();
              }}
            >
              <FiFolderPlus className="w-4 h-4 mr-2" />
              <span>New Folder</span>
            </button>
          )}
          <button
            className="w-full text-left px-4 py-1.5 hover:bg-[#04395e] flex items-center"
            onClick={() => {
              onRenameItem(contextMenu.node!.path, contextMenu.node!.name, contextMenu.node!.type);
              closeContextMenu();
            }}
          >
            <FiEdit className="w-4 h-4 mr-2" />
            <span>Rename</span>
          </button>
          <button
            className="w-full text-left px-4 py-1.5 hover:bg-[#04395e] flex items-center text-[#ff6b6b]"
            onClick={() => {
              onDeleteItem(contextMenu.node!.path, contextMenu.node!.type);
              closeContextMenu();
            }}
          >
            <FiTrash2 className="w-4 h-4 mr-2" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
















