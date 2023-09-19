import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

export interface TreeNode {
  name: string;
  isExpanded: boolean;
  children?: TreeNode[];
}

interface TreeFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  isExpanded: boolean;
}

@Component({
  selector: 'rm-tree',
  standalone: true,
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
})
export class TreeComponent {
  @Input({ required: true }) set data(nodes: TreeNode[]) {
    this.dataSource.data = nodes;

    this.expandNodes(this.treeControl.dataNodes);
  }

  private transformer = (node: TreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      isExpanded: node.isExpanded,
    };
  };

  treeControl = new FlatTreeControl<TreeFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: TreeFlatNode) => node.expandable;

  selectionModel = new SelectionModel<TreeFlatNode>(true);

  isIncludingSubfolders = false;

  descendantsPartiallySelected(node: TreeFlatNode): boolean {
    const nodeSelected: boolean = this.selectionModel.isSelected(node);

    if (nodeSelected) {
      return false;
    }

    const descendants: TreeFlatNode[] = this.treeControl.getDescendants(node);
    const someDescSelected: boolean = descendants
        .some((child: TreeFlatNode) => this.selectionModel.isSelected(child));

    return someDescSelected;
  }

  nodeSelectionToggle(node: TreeFlatNode): void {
    this.selectionModel.toggle(node);

    if (!this.isIncludingSubfolders) {
      return;
    }

    const descendants: TreeFlatNode[] = this.treeControl.getDescendants(node);

    this.selectionModel.isSelected(node)
      ? this.selectionModel.select(...descendants)
      : this.selectionModel.deselect(...descendants);
  }

  private expandNodes(nodes: TreeFlatNode[]): void {
    nodes.forEach((node: TreeFlatNode) => {
      if (node.isExpanded) {
        this.treeControl.expand(node);
      }
    });
  }
}
