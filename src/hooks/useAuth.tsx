import { makeRedirectUri, revokeAsync, startAsync } from 'expo-auth-session';
import React, { useEffect, createContext, useContext, useState, ReactNode } from 'react';
import { generateRandom } from 'expo-auth-session/build/PKCE';

import { api } from '../services/api';

interface User {
  id: number;
  display_name: string;
  email: string;
  profile_image_url: string;
}

interface AuthContextData {
  user: User;
  isLoggingOut: boolean;
  isLoggingIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderData {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

const twitchEndpoints = {
  authorization: 'https://id.twitch.tv/oauth2/authorize',
  revocation: 'https://id.twitch.tv/oauth2/revoke'
};

function AuthProvider({ children }: AuthProviderData) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState({} as User);
  const [userToken, setUserToken] = useState('');
  
  const clientID = process.env.CLIENT_ID

  async function signIn() {
    try {
      // set isLoggingIn to true
      setIsLoggingIn(true)

      // REDIRECT_URI - create OAuth redirect URI using makeRedirectUri() with "useProxy" option set to true
      const redirect_uri = makeRedirectUri({
        useProxy: true,
      })

      // RESPONSE_TYPE - set to "token"
      const response_type = 'token'

      // SCOPE - create a space-separated list of the following scopes: "openid", "user:read:email" and "user:read:follows"
      const scope = 'openid user:read:email user:read:follows'

      // FORCE_VERIFY - set to true
      const force_verify = true

      // STATE - generate random 30-length string using generateRandom() with "size" set to 30
      const state = generateRandom(30)

      // assemble authUrl with twitchEndpoint authorization, client_id, 
      // redirect_uri, response_type, scope, force_verify and state
      const authUrl = `http://localhost?endpoint=${'2abobuqg5ivbjbr706b0rjbrasrea5'}&client_id=${clientID}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&force_verify=${force_verify}&state=${state}`
      // call startAsync with authUrl
      const response = await startAsync({
        authUrl
      })
      
      // verify if startAsync response.type equals "success" and response.params.error differs from "access_denied"
      // if true, do the following:
      if(response.type === 'success') {
        // verify if startAsync response.params.state differs from STATE
        // if true, do the following:
        if(response.params.state !== state) {
          // throw an error with message "Invalid state value"
          throw new Error('Invalid state value')
        }

        // add access_token to request's authorization header

        // call Twitch API's users route

        // set user state with response from Twitch API's route "/users"
        // set userToken state with response's access_token from startAsync
      }
    } catch (error) {
      // throw an error
      throw new Error(error.message)
    } finally {
      // set isLoggingIn to false
      setIsLoggingIn(false)
    }
  }

  async function signOut() {
    try {
      // TODO
      // set isLoggingOut to true

      // call revokeAsync with access_token, client_id and twitchEndpoint revocation
    } catch (error) {
    } finally {
      // set user state to an empty User object
      // set userToken state to an empty string

      // remove "access_token" from request's authorization header

      // set isLoggingOut to false
    }
  }

  useEffect(() => {
    // TODO
    // add client_id to request's "Client-Id" header
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoggingOut, isLoggingIn, signIn, signOut }}>
      { children }
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
