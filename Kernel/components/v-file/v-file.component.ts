import { Component, forwardRef, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

interface HTMLInputEvent extends Event
{
  target: HTMLInputElement & EventTarget;
}

@Component
(
  {
    selector: 'v-file',
    templateUrl: './v-file.component.html',
    styleUrls: ['./v-file.component.css'],
    providers:
    [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => VFileComponent),
        multi: true,
      },
    ]
  }
)

export class VFileComponent implements ControlValueAccessor
{
  // public value!: string;
  // public changed!: (value: string) => void;

  public value: any;
  public changed!: (value: any) => void;
  public touched!: () => void;
  public isDisabled!: boolean;
  filename :any='';
  public selectedFile!: any;

  @Input() public parentForm?: FormGroup;
  @Input() public fieldName: any;
  @Input() public required: any;
  @Input() public acceptedFileTypes: any;
  @Input() public label: any;
  @Input() public allowLabel: boolean = true;
  @Input() public isForIndisplay: boolean = false;
  @Input() public hasSuspendedStyle: boolean = false;
  @Input() public readonly: any;
  @Input() public fileClass : any = -1;


  // Get the form field associated with the component
  get formField(): FormControl
  {
    return this.parentForm?.get(this.fieldName) as FormControl;
  }

  constructor(private renderer: Renderer2) { }


  // Handle change event of the file input
  public onChange(event: HTMLInputEvent): void
  {
    console.log("Change Was Done");

    const formData = new FormData();

    formData.append(this.fieldName, event.target.files[0]);

    const reader = new FileReader();

    reader.onload = (e) =>
    {
      let base64Data = e.target.result as string;
      base64Data=event.target.files[0].name+","+base64Data;
      this.changedFile({formData, base64Data});
      this.filename=event.target.files[0].name;
      console.log("FILENAME>>>>>>>>>>",this.filename);
    };

    reader.readAsDataURL(event.target.files[0]);
  }


  // Handle changed file data
  changedFile({ formData, base64Data }: { formData: FormData, base64Data: string })
  {
    //in case file component for inDisplay return base64 encoded image else return Multipart image structure
    // Emit base64 or form data based on component type
    if(this.isForIndisplay)
    {
      this.changed(base64Data);
    }
    else
    {
      this.changed(formData);
    }
  }

  // Write value to the file input
  public writeValue(value: string): void
  {
    //Filter browse file based on acceptedFileTypes
    // Code to handle file type filtering and filename extraction
    if (typeof (this.acceptedFileTypes) != 'undefined')
    {
      if (this.acceptedFileTypes.toLowerCase() == 'images')
      {
        this.acceptedFileTypes = 'image/*';
      }
      else
        if (this.acceptedFileTypes.toLowerCase() == 'documents')
        {
          this.acceptedFileTypes = '.xlsx,.csv,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf';
        }
        else
          if (this.acceptedFileTypes.toLowerCase() == 'all')
          {
            this.acceptedFileTypes = '.xlsx,.xls,.csv,.doc,image/*,.docx,.ppt,.pptx,.txt,.pdf';
          }
          else
          {
            this.acceptedFileTypes = "." + this.acceptedFileTypes;
          }

      console.log("FFFFFFFFF>>>>>>>>>>",this.parentForm?.get(this.fieldName).value);
      console.log("ddddddddd>>>>>>>>>>",this.parentForm?.get(this.fieldName).value);
      
      if(this.parentForm?.get(this.fieldName).value!=null)
      {
        this.filename =this.parentForm?.get(this.fieldName).value.split(",")[0];
      }
    }
  }

  // Register change function
  public registerOnChange(fn: any): void
  {
    this.changed = fn;
  }

  // Register touch function
  public registerOnTouched(fn: any): void
  {
    this.touched = fn;
  }

  // Set disabled state
  public setDisabledState(isDisabled: boolean): void
  {
    this.isDisabled = isDisabled;
  }

  // Trigger file upload
  uploadExec()
  {
    console.log("ZZZZZZZZZZZZZZZZZZZZZZZ");
    
    this.parentForm.get(this.fieldName).markAsTouched();
    $("#uploadBtn_"+this.fieldName).trigger("click");
  }


///////////////MIKE///////////////////
  // Adding an ID property
  public inputId: string = 'myInputId';

  clearInputValue()
  {    
    // Clear both filename and input value if filename is not empty
    this.filename = ''; // Clear filename
    const inputElement = this.renderer.selectRootElement('#' + this.inputId);
    this.renderer.setProperty(inputElement, 'value', ''); // Clear input value

    // Call removeFromStorage to remove the document and clear the form field value
    this.removeFromStorage();
  }


  removeFromStorage()
  {
    try
    {
      // Step 1: Retrieve Filename or Identifier
      const filenameOrIdentifier = this.parentForm?.get(this.fieldName)?.value;

      if (filenameOrIdentifier)
      {
        // Step 2: Remove File from localStorage
        const storedData = localStorage.getItem(filenameOrIdentifier);

        if (storedData)
        {
          // File exists, remove it from storage
          localStorage.removeItem(filenameOrIdentifier);
          //console.log(`Document '${filenameOrIdentifier}' removed from storage.`);
        }
        else
        {
          // File not found in storage
          // console.warn(`Document '${filenameOrIdentifier}' not found in storage.`);
        }
      }
      else
      {
        // Handle case where filename or identifier is empty or undefined
        // console.warn('Filename or identifier not provided.');
      }

      // Step 3: Clear the form field value
      this.parentForm?.get(this.fieldName)?.reset(); // Resets the form field value
      // console.log('Form field value cleared.');
    }
    catch (error)
    {
      // Handle any errors
      console.error('Error removing document from storage or clearing form field:', error);
    }
  }
  
/////////////////////////////

  // Trigger file download
  downloadExec()
  {
    // Code to handle file download
    let newElement=this.parentForm?.get(this.fieldName).value.split(",")[2];
    
    const fileType = this.parentForm?.get(this.fieldName).value.split(",")[1].split(":")[1].split(";")[0];
    const fileName =this.parentForm?.get(this.fieldName).value.split(",")[0];
    const byteCharacters = atob(newElement);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++)
    {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
     
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = fileName;
    link.click();

    // Release the object URL
    URL.revokeObjectURL(url);
  }
}