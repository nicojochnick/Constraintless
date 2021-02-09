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
import {convertFromRaw, EditorState, RichUtils} from "draft-js";



function Home(props) {
    const [backgroundColor, setBackGroundColor] = React.useState('#000000')
    const [query, setstateQuery] = React.useState(null);
    const [response,setResponse] = React.useState( null);
    const [responseID, setResponseID] = React.useState(null)
    const [isEditing, setIsEditing] = React.useState(false);
    const [queryID, setQueryID] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [parsedBody, setParsedBody] = React.useState(EditorState.createEmpty());
    const [parsed, setParsed] = React.useState(false)

    const classes = useStyles();

    const setQuery = (query) => {
        if (query) {
            console.log('Setting Query and ID:', query, query.queryID);
            setstateQuery(query);
            setQueryID(query.queryID);
            if (query.responseID !== '0') {
                console.log('****setting responseID: ', query.responseID);
                setResponseID(query.responseID);
                pullResponse(query.responseID)
            }
        }
    };


    const pullResponse = async(responseID) => {
        let resRef = await db.collection('models').doc(responseID);
        resRef.get().then((doc)=> {
                if (doc.exists) {
                    let res = doc.data()
                    console.log("Document data:", res);
                    setResponse(res)
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }
        )
    };

    useEffect(() => {
        console.log('triggered updates with the queryID:', queryID)
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
        <div className={classes.root}>
            <Grid container>
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
                direction="row"
                justify="center"
                alignItems="center"
                container
                style = {{minHeight: 600}}
            >
                <Grid item xs={12} sm = {6} md = {5} lg = {5}>
                    <Problem setQuery = {setQuery}/>
                </Grid>
                <Grid spacing={0} item xs={12} sm = {6} md = {7} lg = {7}>

                    <Box style = {{maxHeight: 700, backgroundColor:'black'}} className={classes.inner_box}>
                    < Solution
                        query = {query}
                        parsedBody = {parsedBody}
                        response = {response}
                    />
                        </Box>
                </Grid>
            </Grid>
            </Grid>
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor:'black',
        overflowX: 'hidden',
    },
    paper: {
        padding: theme.spacing(0),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    box:{
        flexGrow: 1,
        padding: 0,
        display: 'start',
        overflow: 'auto',
        flexDirection: 'column',
        position: 'relative',
        // overflowY: 'hidden',
        overflowX: 'hidden',
        // margin: 10,
        // marginBottom: 20,
        // backgroundColor: 'white',
    },


    inner_box:{
        flexGrow: 1,
        padding: 0,
        display: 'start',
        overflowY: 'scroll',
        overflowX: 'hidden',
        flexDirection: 'column',
        backgroundColor: 'white',
        marginRight: -15
    },

}));

export default Home;
