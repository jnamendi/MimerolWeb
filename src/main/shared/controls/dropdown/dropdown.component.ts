import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DropdownModel } from '../../models';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  @Input() data: DropdownModel[];
  @Input() selected?: DropdownModel;
  @Output() onSelectedChange: EventEmitter<DropdownModel> = new EventEmitter();

  private isFocus: boolean;
  private selectedItem: DropdownModel;
  private isToggleDropdown: boolean;

  constructor() {
  }

  ngOnInit(): void {
    if (!this.selected && this.data) {
      this.selectedItem = this.data[0];
    }
  }

  onDropdownChange = (item: DropdownModel) => {
    this.selectedItem = item;
    this.onSelectedChange.emit(item);
  }

  onToggleDropdown = (isToggle: boolean) => {
    this.isToggleDropdown = isToggle ? false : !this.isToggleDropdown;
  }
}
