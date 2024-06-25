import { Component, VERSION, ViewChild, ElementRef, AfterViewInit, Output,EventEmitter,Input } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import SignaturePad from "signature_pad";

@Component({
  selector: "app-v-signature",
  templateUrl: "./v-signature.component.html",
  styleUrls: ["./v-signature.component.css"]
})
export class VSignatureComponent implements AfterViewInit {
  name = "Angular " + VERSION.major;
  @ViewChild("canvas", { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @Output() signaturedata=new EventEmitter<any>();
  @Input() oldsignature:any;
   sig: SignaturePad;
   ctx:any

   iframeUrl: SafeResourceUrl;
   constructor(private sanitizer: DomSanitizer) {
       this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/STPadServer.html');
     }
  //  private ctx: CanvasRenderingContext2D;
   private imageUrl: string ;

  ngAfterViewInit() {
    
    if(localStorage.getItem("signatureImage")!=""){
      this.oldsignature=localStorage.getItem("signatureImage");
      localStorage.removeItem("signatureImage");
    }

    console.log("kkkkkkkkkkkk::",this.oldsignature);
    // Create a new SignaturePad instance
    this.sig = new SignaturePad(this.canvas.nativeElement);
    
    // Simulate a machine-generated signature
    this.generateMachineSignature();
  
  }

  ngOnChanges(changes: any) {
    console.log("changes11111111::",changes);
    console.log("changes222-------------",changes.oldsignature.currentValue);   
this.imageUrl=changes.oldsignature.currentValue;
this.loadAndDrawImage();
  }

  generateMachineSignature() {
    // Get the 2D rendering context of the canvas
      this.ctx = this.canvas.nativeElement.getContext("2d");
    console.log("imagessssssss::",this.oldsignature);
    if(this.imageUrl !==undefined || this.imageUrl!=""){
    console.log("ifffffffffffffffff::");

      
    }
  
  }


  loadAndDrawImage() {
    const image = new Image();

    image.onload = () => {
       this.ctx.drawImage(image, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    };
    image.src = this.oldsignature;
    console.log("image----------",image);
  }
  clear() {
    this.sig.clear();
  }

  // save() {
  //   const signatureData1= this.sig.toDataURL();
  //   console.log('Signature Data11111111:', signatureData1);
  //   this.signaturedata.emit(signatureData1);
  // }
  onMouseOut(){
    const signatureData1= this.sig.toDataURL();
    console.log('Signature Data11111111:', signatureData1);
    this.signaturedata.emit(signatureData1);
  }
}