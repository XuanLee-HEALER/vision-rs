import type { MDXComponents } from 'mdx/types';
import BorrowChecker from '@/components/BorrowChecker';
import LifetimeAnimation from '@/components/LifetimeAnimation';
import MemoryLayout3D from '@/components/MemoryLayout3D';
import MermaidDiagram from '@/components/MermaidDiagram';
import OwnershipFlow from '@/components/OwnershipFlow';
import TraitRelationship from '@/components/TraitRelationship';
import LearnLayout from '@/components/LearnLayout';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    LearnLayout,
    BorrowChecker,
    LifetimeAnimation,
    MemoryLayout3D,
    Mermaid: MermaidDiagram,
    OwnershipFlow,
    TraitRelationship,
    ...components,
  };
}
