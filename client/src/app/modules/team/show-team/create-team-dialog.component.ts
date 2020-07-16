import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { CreateTeamData } from './create-team-data';

@Component({
  selector: 'app-create-team-dialog',
  templateUrl: './create-team-dialog.html'
})

export class CreateTeamDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateTeamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTeamData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
