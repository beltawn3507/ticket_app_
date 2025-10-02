import { CustomError } from "./custom-error";


export class BadRequesterror extends CustomError{
    statusCode= 400;

    constructor(public message:string){
        super(message);

        Object.setPrototypeOf(this,BadRequesterror.prototype);
    }


    serializeErrors(){
        return [{message:this.message}]
    }
}