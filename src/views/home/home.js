import React, {useEffect} from 'react';
import Problem from "../../components/user/problem";
import Solution from "../../components/user/solution";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import constraintless from "../../assets/constraintless.png"
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {BiDoorOpen} from "react-icons/bi";
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import {db} from "../../api/firebase";



function Home(props) {
    const [backgroundColor, setBackGroundColor] = React.useState('#000000')
    const [query, setstateQuery] = React.useState(null);
    const [response,setResponse] = React.useState( null);
    const [responseID, setResponseID] = React.useState(null)
    const [isEditing, setIsEditing] = React.useState(false);
    const [queryID, setQueryID] = React.useState(null);
    const [error, setError] = React.useState(null)

    const classes = useStyles();

    const setQuery = (query) => {
        console.log('Setting Query and ID:', query, query.queryID);
        setstateQuery(query);
        setQueryID(query.queryID);
        if (query.responseID !== '0'){
            console.log('****setting responseID: ', query.responseID);
            setResponseID(query.responseID);
            pullResponse(query.responseID)
        }
    };

    const pullResponse = async(responseID) => {
        let resRef = await db.collection('models').doc(responseID);
        resRef.get().then((doc)=> {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    setResponse(doc.data())
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }
        )
    };

    useEffect(() => {
        console.log('triggered updates')
        if(queryID) {
            const unsubscribe = db.collection('queries').doc(queryID)
                .onSnapshot(doc => {
                        let que = doc.data();
                        console.log('listener added', que);
                        setQuery(que)
                    },
                    err => {
                        setError(err)
                    })

            // returning the unsubscribe function will ensure that
            // we unsubscribe from document changes when our id
            // changes to a different value.
            return () => unsubscribe()
        }
        },
        [queryID]
    );

    return (
        <div style = {{backgroundColor:backgroundColor}}  className={classes.root}>
            <Grid justify='space-between' alignItems='space-between' container direction='row' >
                <Grid item >
                <img style = {{height: 50, margin: 10}} src={constraintless}/>
                </Grid>
                <Link to={`/login`} style={{ textDecoration: 'none' }}>
                <IconButton aria-label="delete">
                    <BiDoorOpen style = {{color: "white", margin: 20}}/>
                </IconButton>
                </Link>
            </Grid>
            <Grid
                style = {{height: '75vh'}}
                direction="row"
                justify="center"
                alignItems="center"
                container
            >
                <Grid item xs={12} md = {6} lg = {6}>
                    <Problem setQuery = {setQuery}/>
                </Grid>
                <Grid item xs={12} md = {6} lg = {6}>
                    <Solution
                        query = {props.query}
                        response = {response}
                    />
                </Grid>
            </Grid>
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(0),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default Home;
