import { resolvePlugin } from '@babel/core';
import RNFetchBlob from 'rn-fetch-blob';

export interface UserInterface {
  email?: string | null,
  password?: string | null
}

interface Data {
  user: UserInterface,
  data: any
}


type Methods = "POST" | "GET" | "DELETE" | "PUT";

export default class Server {

  /*  
    {
      user: {
        email,
        password
      },
      data: {
  
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

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
    this.loggedIn = true;
    console.log('server:', this.serverUrl);
  }

  // user actions

  /**
   * Get loggedIn user information
   * @returns User | false
   */
  getUser(): UserInterface | false {
    if (this.loggedIn) {
      let userObject: UserInterface = {
        email: this.userEmail
      }

      return userObject;
    } else {
      return false;
    }
  }

  /**
   * Log in
   * @param email Email adress
   * @param password Password
   * @returns Promise (resolve, reject) -> returned data form server
   */
  login(email: string, password: string) {

    console.log('starting log in procedure');

    return new Promise((resolve, reject) => {
      this.executeFetchData('login', 'POST', {
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
        resolve(res);
      }, (res) => {
        // failed
        this.loggedIn = false;
        console.log('cannot login');
        reject(res);
      });
    });

  }


  /**
   * Register
   * @param email Email adress
   * @param password Password
   * @param login Automatic login after registration (default -> true)
   * @returns Promise (resolve, reject) -> returned data form server
   */
  register(email: string, password: string, login: boolean = true) {

    console.log('starting register procedure');

    return new Promise((resolve, reject) => {
      this.executeFetchData('register', 'POST', {
        user: {
          email: email,
          password: password
        },
        data: null
      }).then((res) => {
        // success
        console.log('register success');
        if (login) {
          this.userEmail = email;
          this.userPassword = password;
          this.loggedIn = true;
          console.log('logged in');
        }
        resolve(true);
      }, (res) => {
        // failed
        console.log('register failed');
        reject(res);
      });
    });

  }

  // fetching data

  /**
   * Receive data from server (formated to include the user credentionals)
   * @param url Url path to request. example: (example/1)
   * @param method Fetch method to use (GET, POST, DELETE, PUT, PATCH)
   * @param data Data to be send to server
   * @param loggedIn Only allowed if the user is logged in. (default -> true)
   * @returns Promise (resolve, reject) -> returned data form server
   */
  fetchData(url: string, method: Methods, data: any, loggedIn: boolean = true) {
    if (loggedIn) {
      if (this.loggedIn) {
        let fullData: Data = {
          user: {
            email: this.userEmail,
            password: this.userPassword
          },
          data: data
        }
        return this.executeFetchData(url, method, fullData);
      } else {
        return new Promise((resolve, reject) => {
          reject('Not logged in.');
        });
      }
    } else {
      let fullData: Data = {
        user: {
          email: null,
          password: null
        },
        data: data
      }
      return this.executeFetchData(url, method, fullData);
    }
  }

  /**
   * Receive data from server
   * @param url Url path to request. example: (example/1)
   * @param method Fetch method to use (GET, POST, DELETE, PUT)
   * @param fullData Data to be send to server
   * @returns Promise (resolve, reject) -> returned data form server
   */
  private executeFetchData(url: string, method: Methods, fullData: Data) {

    console.log(method, url, fullData);

    return new Promise((resolve, reject) => {
      console.log("Data:", fullData);
      RNFetchBlob.fetch(method, `${this.serverUrl}${url}`, {
        'content-Type': 'application/json'
      },
        JSON.stringify(fullData)
      ).then((res) => {
        console.log("Request:", `${this.serverUrl}${url}`);
        const status = res.info().status;
        if (status == 200) {
          // succes
          resolve(res.data);
        } else {
          // error
          console.log('error', res.data);
          reject(res.data);
        }

      });
    });
  }

}



//export default Server;