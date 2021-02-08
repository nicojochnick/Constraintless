import React, { useEffect, useState } from 'react';
import Grid from "@material-ui/core/Grid";
import constraintless from "../assets/constraintless.png";
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import {BiDoorOpen,BiArrowToRight} from "react-icons/bi";
import {db} from "../api/firebase";
import { makeStyles, fade } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import firebase from 'firebase/app';
import Query from "../components/admin/query"
import TextField from "@material-ui/core/TextField/TextField";
import { BiQuestionMark, BiPlus, BiSearch} from "react-icons/bi"


export default function Admin(props) {
    const classes = useStyles();

    const [queries, setQueries] = React.useState([]);
    const [responseID, setResponseID] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleLogout = async() => {
        firebase.auth().signOut().then(function() {
        }).catch(function(error) {
        });
    };

    const sendResponse = async (responseID, queryID) => {

        let qs = queries;
        for (let q in qs) {
            if (qs[q].queryID == queryID){
                qs.splice(q,1)
            }
        }

        const queryRef = await db.collection('querys').doc(queryID);
        const res = await queryRef.update(
            {responseID: responseID}
        );

        await refreshQueries()

    };


    const refreshQueries = async() => {
        console.log('refreshing....')
        setLoading(true)

        db.collection('querys')
            .where('responseID', '==', '0')
            .onSnapshot((querySnapshot) => {
                    let queries = [];
                    querySnapshot.forEach(function (doc) {
                        queries.push(doc.data())
                    });
                    setQueries(queries);
                }
            );
        setLoading(false)
        //TODO: sortbytimeStamp
    };

    useEffect(() => {
        refreshQueries()
    }, []);

    return (
        <div>
            <Grid justify='space-between' alignItems={'space-between'} container direction='row'>
                <Grid item >
                    <img style = {{height: 60, margin: 10}} src={constraintless}/>
                </Grid>
                    <IconButton aria-label="delete">
                        <BiDoorOpen onClick = {()=>handleLogout()} style = {{color: "white", margin: 20}}/>
                    </IconButton>
            </Grid>
            <Grid container justify = 'center' alignItems = 'center' direction='column'>

                <Grid >
                    {loading
                        ? null
                        : <div>
                            {queries.map((item) =>
                                <Query query={item} sendResponse={sendResponse}/>
                            )}
                        </div>
                    }
                </Grid>
            </Grid>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },

    box: {
        color: "white",
        width: 200,
    },

    textField: {
        disableUnderline: true,
        color: 'white',

    }
}));

