"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiFolder, FiCloud } from "react-icons/fi";
import { FaGoogleDrive, FaAws } from "react-icons/fa";

interface Node {
  x: number;
  y: number;
  color: string;
  connections: number[];
  icon: React.ElementType; // Added to store the randomly chosen icon
}

export function NetworkAnimation() {
  const [isClient, setIsClient] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 680, height: 700 });

  const getLineLength = React.useCallback((node: Node, targetNode: Node) => {
      const dx = targetNode.x - node.x;
      const dy = targetNode.y - node.y;
      return Math.sqrt(dx * dx + dy * dy);
  }, []);

  React.useEffect(() => {
    setIsClient(true);
    const getParentDimensions = () => {
      const parent = containerRef.current?.parentElement;
      if (parent) {
        const { clientWidth, clientHeight } = parent;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    getParentDimensions();

    const resizeObserver = new ResizeObserver(getParentDimensions);
    if (containerRef.current?.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const getInitialNodes = React.useCallback((): Node[] => {
    const safeWidth = Math.max(dimensions.width - 100, 100);
    const safeHeight = Math.max(dimensions.height - 100, 100);
    const minDistance = 100;

    const getRandomPosition = () => ({
      x: 50 + Math.random() * safeWidth,
      y: 50 + Math.random() * safeHeight,
    });

    const isValidPosition = (pos: { x: number; y: number }, existingNodes: Node[]) => {
      return existingNodes.every(
        (node) => Math.sqrt(Math.pow(node.x - pos.x, 2) + Math.pow(node.y - pos.y, 2)) >= minDistance
      );
    };

    const icons = [FiFolder, FiCloud, FaGoogleDrive, FaAws]; // Array of icons

    const nodes: Node[] = [];
    let attempts = 0;
    const maxAttempts = 100;

    while (nodes.length < 16 && attempts < maxAttempts) {
      const pos = getRandomPosition();
      if (nodes.length === 0 || isValidPosition(pos, nodes)) {
        const randomIcon = icons[Math.floor(Math.random() * icons.length)]; // Randomly select an icon
        nodes.push({
          x: pos.x,
          y: pos.y,
          color: "#fff", // All nodes are bright white now
          connections: [],
          icon: randomIcon, // Store the icon in the node
        });
        attempts = 0;
      } else {
        attempts++;
      }
    }

    return nodes;
  }, [dimensions]);

  const initialNodes: Node[] = getInitialNodes();
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes);
  const [activeLines, setActiveLines] = React.useState<number[]>([]);

  const getRandomConnections = React.useCallback(() => {
    const numConnections = Math.floor(Math.random() * 2) + 1;
    return Array.from({ length: numConnections }, () => Math.floor(Math.random() * nodes.length)).filter(
      (value, index, self) => self.indexOf(value) === index
    );
  }, [nodes.length]);

  React.useEffect(() => {
    const updateConnections = () => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({
          ...node,
          connections: getRandomConnections(),
        }))
      );
    };

    updateConnections();
    const connectionInterval = setInterval(updateConnections, 3000);
    return () => clearInterval(connectionInterval);
  }, [getRandomConnections]);

  React.useEffect(() => {
    const updateActiveLines = () => {
      const totalLines = nodes.reduce((acc, node) => acc + node.connections.length, 0);

      // Generate a random number of active lines between 2 to 5
      const randomActiveLinesCount = Math.floor(Math.random() * 4) + 2; // Random number between 2 and 5

      // Randomly pick `randomActiveLinesCount` lines from the total lines
      const activeLinesSet = new Set<number>();
      while (activeLinesSet.size < randomActiveLinesCount) {
        const randomLine = Math.floor(Math.random() * totalLines);
        activeLinesSet.add(randomLine);
      }

      setActiveLines(Array.from(activeLinesSet)); // Convert the Set to an array
    };

    const lineInterval = setInterval(updateActiveLines, 1500);
    return () => clearInterval(lineInterval);
  }, [nodes]);

  const getNodeStyles = React.useCallback((y: number) => {
    const opacity = 1; // Full opacity for all nodes
    const scale = 1 - (y / dimensions.height) * 0.4;
    return { opacity, scale };
  }, [dimensions.height]);

  const viewBox = React.useMemo(() => {
    return `0 0 ${Math.max(dimensions.width, 100)} ${Math.max(dimensions.height, 100)}`;
  }, [dimensions]);

  const renderLines = React.useCallback(
      (node: Node, i: number) => {
          return node.connections.map((targetIndex, connectionIndex) => {
              const lineIndex = nodes.slice(0, i).reduce((acc, n) => acc + n.connections.length, 0) + connectionIndex;
              const isActive = activeLines.includes(lineIndex);
              const lineLength = getLineLength(node, nodes[targetIndex]);
              const duration = lineLength / 400;

              return (
                  <motion.path
                      key={`line-${i}-${targetIndex}`}
                      d={`M ${node.x} ${node.y} L ${nodes[targetIndex].x} ${nodes[targetIndex].y}`}
                      stroke={isActive ? "#fff" : "#ddd"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 1, opacity: 0.1 }}
                      animate={
                          isActive
                              ? {
                                    pathOffset: [0, 1],
                                    opacity: [0.1, 0.8, 0.1],
                                    transition: {
                                        pathOffset: { duration, ease: "linear" },
                                        opacity: { duration, times: [0, 0.5, 1], ease: "easeInOut" },
                                    },
                                }
                              : {
                                    pathOffset: 0,
                                    opacity: 0.1,
                                    transition: { duration: 0.2, ease: "easeOut" },
                                }
                      }
                  />
              );
          });
      },
      [nodes, activeLines, getLineLength] // Now `getLineLength` is stable
  );

  if (!isClient) {
    return <div ref={containerRef} className="absolute inset-0 bg-transparent pointer-events-none" />;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 bg-transparent pointer-events-none">
      <svg className="absolute inset-0 w-full h-full opacity-85" viewBox={viewBox}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feFlood floodColor="currentColor" floodOpacity="0.7" result="colorFlood" />
            <feComposite in="colorFlood" in2="coloredBlur" operator="in" result="coloredBlurAlpha" />
            <feMerge>
              <feMergeNode in="coloredBlurAlpha" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {nodes.map((node, i) => renderLines(node, i))}
        {nodes.map((node, index) => {
          const { opacity, scale } = getNodeStyles(node.y);
          const IconComponent = node.icon; // Use the randomly selected icon for the node

          return (
            <g key={`node-${index}`}>
              <motion.rect
                x={node.x - 24 * scale}
                y={node.y - 24 * scale}
                width={48 * scale}
                height={48 * scale}
                rx={12 * scale}
                fill="#fff" // Bright white node fill color
                initial={{ opacity }}
                animate={{
                  opacity,
                  scale: [scale * 0.95, scale * 1.05, scale],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                filter="url(#glow)"
              />
              <foreignObject
                x={node.x - 24 * scale}
                y={node.y - 24 * scale}
                width={48 * scale}
                height={48 * scale}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <IconComponent
                    style={{
                      color: "#000",
                      width: `${28 * scale}px`, // Added 'px' unit
                      height: `${28 * scale}px`, // Added 'px' unit
                      opacity: opacity * 0.9,
                    }}
                  />
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
