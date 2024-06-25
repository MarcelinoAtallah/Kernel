import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class FormstateService {

  constructor() { }
  private formData: FormGroup;
  private isFormSaved: boolean = false;

  getForm(): FormGroup {
    return this.formData;
  }

  setForm(form: FormGroup): void {
    this.formData = form;
  }

  isSaved(): boolean {
    return this.isFormSaved;
  }

  markAsSaved(): void {
    this.isFormSaved = true;
  }

  markAsUnsaved(): void {
    this.isFormSaved = false;
  }
}
