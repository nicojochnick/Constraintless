import { auth } from "../api/firebase";
import {db} from "../api/firebase";
import {storage} from "../api/firebase";

export async function Signup(email, password) {
    return auth().createUserWithEmailAndPassword(email, password);
};

export function Signin(email, password) {
    return auth().signInWithEmailAndPassword(email, password);
};
