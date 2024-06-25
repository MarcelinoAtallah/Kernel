import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { DataService } from "./data.service";
import { DatacrowdService } from "./datacrowd.service";

export class Message {
  constructor(public author: any, public content: any) {}
}

@Injectable()
export class ChatService {
//   audioFile = new Audio(
//     "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3"
//   );
  constructor(public DatacrowdService:DatacrowdService) {}

  conversation = new Subject<Message[]>();

  messageMap :any= {
    "Hi": "Hello",
    "Who are you": "My name is Agular Bot",
    "What is Angular": "Angular is the best framework ever",
    default: "I can't understand. Can you please repeat"
  };

  async getBotAnswer(msg: any) {
    const userMessage = new Message("user", {answer:msg});
    this.conversation.next([userMessage]);
    let resulttl:any;
   await this.getBotMessage(msg).then((res:any)=>{
      resulttl=res;
    })
    const botMessage:any = new Message("bot",resulttl);

    setTimeout(() => {
    //   this.playFile();
      this.conversation.next([botMessage]);
    }, 1500);
  }

//   playFile() {
//     this.audioFile.play();
//   }

//   playAudio() {
//     // this.playFile("https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3");
//   }

  async getBotMessage(question: any) {
    let obj:any={
      prompt:question
    }
    let res:any;
   await this.DatacrowdService.getchatbotMessage(obj).then((result:any)=>{
      console.log("res getchatbotMessage",result);
     res=result
    })

   return res;

  }
}
