import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ConfigModalComponent } from './modals/config-modal/config-modal.component';
import { IFormsList } from './models/forms-list';
import { UserModalComponent } from './modals/user-modal/user-modal.component';
import { IConfig } from './models/config';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public formsList: IFormsList[] = [
    {
      type: 'text',
      label: 'Text',
      config: { label: '', value: '' },
    },
    {
      type: 'email',
      label: 'Email',
      config: { label: '', value: '' },
    },
    {
      type: 'password',
      label: 'Password',
      config: { label: '', value: '' },
    },
  ];

  public userForms: IFormsList[] = [];
  public allForms: any = [];

  public settingsForm!: FormGroup;
  public isEdit: boolean = false;
  
  constructor(private _modalService: NzModalService) {}

  ngOnInit(): void {}

  public drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      let data = JSON.stringify(event.previousContainer.data);
      let previousData = JSON.parse(data);
      copyArrayItem(
        previousData,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this._openConfigModal(event.container.data, event.currentIndex);
    }
  }

  public submit() {
    if (this.isEdit) {

    } else {
      this._openUserModal();
    }
  }

  public deleteFromAllForm(index: number) {
    this.allForms.splice(index, 1);
  }

  public deleteForm(index: number) {
    this.userForms.splice(index, 1);
  }

  public edit(value: IFormsList[]) {
    this.isEdit = true;
    this.userForms = value;
  }

  private _openConfigModal(userForm: IFormsList[], index: number) {
    this._modalService.create({
      nzTitle: 'Configurations',
      nzContent: ConfigModalComponent,
      nzWidth: '500px',
      nzOkText: 'Save',
      nzCancelText: 'Cancel',
      nzComponentParams: { initialValues: userForm[index].config },
      nzOnCancel: () => {
        this.userForms.splice(index, 1);
      },
      nzOnOk: (instance: ConfigModalComponent) => {
        this.userForms[index].config = instance.configForm.value;
      },
    });
  }

  private _openUserModal() {
    this._modalService.create({
      nzTitle: 'User form information',
      nzContent: UserModalComponent,
      nzWidth: '500px',
      nzOkText: 'Save',
      nzCancelText: 'Cancel',
      nzOnOk: (instance: UserModalComponent) => {
        this.allForms.push({
          name: instance.name.value,
          created_date: new Date(),
          value: [...this.userForms],
        });
        this.userForms = [];
      },
    });
  }
}
