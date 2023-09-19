import { Component, inject, Signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { TreeComponent, TreeNode } from '@rentman-test/ui/tree';

import { AppService, Node, Nodes } from './app.service';

@Component({
  standalone: true,
  selector: 'rm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    TreeComponent,
  ],
})
export class AppComponent {
  private readonly appService = inject(AppService);

  private readonly treeNodes$: Observable<TreeNode[]> = this.appService.getNodes().pipe(
    map((nodes: Nodes) => this.mapNodesToTreeNodes(nodes)),
    map((treeNodes: TreeNode[]) => this.sortByName(treeNodes)),
  );

  treeNodes: Signal<TreeNode[]> = toSignal(this.treeNodes$, { initialValue: [] });

  private mapNodesToTreeNodes(nodes: Nodes): TreeNode[] {
    const clonedNodes: Nodes = structuredClone(nodes);
    const treeNodes: TreeNode[] = [];

    for (const id in clonedNodes) {
      const node: Node = nodes[id];

      if (node.parentId !== null) {
        nodes[node.parentId]?.children.push(node);
      } else {
        treeNodes.push(node);
      }
    }

    return treeNodes;
  }

  private sortByName(treeNodes: TreeNode[]): TreeNode[] {
    treeNodes.sort((treeNodeA, treeNodeB) =>
      treeNodeA.name.localeCompare(treeNodeB.name));

    treeNodes.forEach((treeNode: TreeNode) => {
      if (!!treeNode.children && treeNode.children.length > 0) {
        this.sortByName(treeNode.children);
      }
    });

    return treeNodes;
  }
}
