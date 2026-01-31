import type { MDXComponents } from 'mdx/types';
import BorrowChecker from './BorrowChecker';
import LifetimeAnimation from './LifetimeAnimation';
import MemoryLayout3D from './MemoryLayout3D';
import MermaidDiagram from './MermaidDiagram';
import OwnershipFlow from './OwnershipFlow';
import TraitRelationship from './TraitRelationship';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    BorrowChecker,
    LifetimeAnimation,
    MemoryLayout3D,
    Mermaid: MermaidDiagram,
    OwnershipFlow,
    TraitRelationship,
    ...components,
  };
}
