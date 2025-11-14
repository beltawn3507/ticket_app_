import nats, { Stan } from "node-nats-streaming";


// this class create obejct like mongodb 
class NatsWrapper {
  private _client?: Stan;

//   this function make sure we can connect to nat only when it is connected to 
// nat server
  get client(){
    if(!this._client){
        throw new Error('Cannot Nat client before connecting')
    }
    return this._client;
  }

  // we can connect to nats server just like mongo server now
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    // we are returning a promise that if the client connects to the server we will console 
    // log and then call resolve function
    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to Nats");
        resolve();
      });
      this.client.on('error',(err)=>{
        reject(err);
      })
    });
  }
}

export const natsWrapper = new NatsWrapper();
