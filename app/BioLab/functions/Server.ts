import { resolvePlugin } from '@babel/core';
import RNFetchBlob from 'rn-fetch-blob';

interface User {
  email?: string | null,
  password?: string | null
}

interface Data {
  user: User,
  data: any
}

class Server{

/*  
  {
    user: {
      email,
      password
    },
    data: {

    }
  }
*/

  serverUrl: string;

  loggedIn: boolean;

  userEmail?: string;
  private userPassword?: string;

  constructor(serverUrl: string){
    this.serverUrl = serverUrl;
    this.loggedIn = false;
    console.log('server:', this.serverUrl);
  }

  login(email: string, password: string){

    console.log('starting log in procedure');

    return new Promise((resolve, reject) => {
      this.executeFetchData('login', {
        user: {
          email: email,
          password: password
        },
        data: null
      }).then((res) => {
        // success
        this.userEmail = email;
        this.userPassword = password;
        this.loggedIn = true;
        console.log('logged in');
        resolve(true);
      }, () => {
        // failed
        this.loggedIn = false;
        console.log('cannot login');
        reject(false);
      });
    });

  }

  register(email: string, password: string, login: boolean = true){

    console.log('starting register procedure');

    return new Promise((resolve, reject) => {
      this.executeFetchData('register', {
        user: {
          email: email,
          password: password
        },
        data: null
      }).then((res) => {
        // success
        console.log('register success');
        if(login){
          this.userEmail = email;
          this.userPassword = password;
          this.loggedIn = true;
          console.log('logged in');
        }
        resolve(true);
      }, () => {
        // failed
        console.log('register failed');
        reject(false);
      });
    });

  }

  fetchData(url: string, data: any, loggedIn: boolean = true){
    if(loggedIn){
      if(this.loggedIn){
        let fullData: Data = {
          user: {
            email: this.userEmail,
            password: this.userPassword
          },
          data: data
        }
        return this.executeFetchData(url, fullData);
      }else{
        return new Promise((resolve, reject) => {
          reject('Not logged in.');
        });
      }
    }else{
      let fullData: Data = {
        user: {
          email: null,
          password: null
        },
        data: data
      }
      return this.executeFetchData(url, fullData);
    }
  }

  private executeFetchData(url: string, fullData: Data){
    return new Promise((resolve, reject) => {
      RNFetchBlob.fetch('POST', `${this.serverUrl}${url}`, {
        'content-Type': 'application/json' },
        JSON.stringify(fullData)
      ).then((res) => {

        const status = res.info().status;
        if(status == 200){
          // succes
          resolve(res.data);
        }else{
          // error
          console.log('error', res.data);
          reject(res.data);
        }

      });
    });
  }

}



export default Server;