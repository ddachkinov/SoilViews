export const signIn = (credentials) => {
    return(dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
        .then(()=>{
            dispatch({type: "LOGIN_SUCCESS"})
        })
        .catch((err)=>{
           dispatch({type: 'LOGIN_ERROR', err})
        })
    }

}

export const signOut = () => {
    return(dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        firebase.auth().signOut()
        .then(()=>{
            dispatch({type: "SIGNOUT_SUCCESS"})
        })
    }
}

export const sendPasswordResetEmail = (emailAddress) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
      const firebase = getFirebase();
      
      firebase.auth().sendPasswordResetEmail(
        emailAddress
      ).then(() => {
        dispatch({ type: 'PASSWORD_RESET_SUCCESS' });
      }).catch((err) => {
        dispatch({ type: 'PASSWORD_RESET_ERROR', err});
      });
    }
  }

  export const sendMessage = (message) =>{
    return(dispatch, getState, { getFirebase, getFirestore }) =>{
        // TODO: Set types and bindActionCreators
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        firestore.collection('messages').add({
          ...message,
          authorFirstName: profile.firstName,
          authorLastName: profile.lastName,
          authorId: authorId,
          createdAt: new Date()
        }).then(() =>{
          dispatch({type:'send_message', message})
        }).catch((err)=>{
          dispatch({type:'send_message_ERROR', err})
        })
      }
}
    



export const signUp = (newUser) => {
    return(dispatch,getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        firebase.auth().createUserWithEmailAndPassword(
            newUser.email,
            newUser.password
        ).then( (resp)=> {
             return firestore.collection('users').doc(resp.user.uid).set({
                 firstName: newUser.firstName,
                 lastName: newUser.lastName,
                 initials: newUser.firstName[0] + newUser.lastName[0],
                 email:newUser.email,
                 telephone:newUser.telephone,
                 city:newUser.city
             })
        }).then(()=>{
            dispatch({type:'SIGNUP_SUCCESS'})
        }).catch((err)=>{
            dispatch({type:'SIGNUP_ERROR',err})
        })
    }
}