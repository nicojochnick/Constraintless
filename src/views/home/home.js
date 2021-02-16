import React, {useEffect} from 'react';
import Problem from "../../components/search/problem";
import Solution from "../../components/search/solution";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import constraintless from "../../assets/constraintless.png"
import blacklogo from "../../assets/blacklogo.png"
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {BiDoorOpen, BiUser} from "react-icons/bi";
import AppBar from '@material-ui/core/AppBar';

import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import {db} from "../../api/firebase";
import {convertFromRaw, EditorState, RichUtils} from "draft-js";
import Divider from '@material-ui/core/Divider';
import Typewriter from 'typewriter-effect';
import Feed from "../../components/feed/feed";


function Home(props) {
    const [backgroundColor, setBackGroundColor] = React.useState('#000000')
    const [query, setstateQuery] = React.useState(null);
    const [response,setResponse] = React.useState( null);
    const [responseID, setResponseID] = React.useState(null)
    const [isEditing, setIsEditing] = React.useState(false);
    const [queryID, setQueryID] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [parsedBody, setParsedBody] = React.useState(EditorState.createEmpty());
    const [parsed, setParsed] = React.useState(false);
    const [isReturned, setIsReturned] = React.useState(false);

    const classes = useStyles();

    const setQuery = (query) => {
        if (query) {
            console.log('Setting Query and ID:', query, query.queryID);
            setstateQuery(query);
            setQueryID(query.queryID);
            setResponse(null);
            setResponseID(null);
            setIsReturned(false);
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
                    setResponse(res);
                    setIsReturned(true);
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
                <AppBar position="fixed">

                <Grid style = {{ backgroundColor: 'white', boxShadow: "0px 2px 10px #C9C9C9"}} justify='space-between' alignItems='space-between' container direction='row' >
                <Grid item >
                    <Link to="/">
                        <img style = {{height: 50, margin: 10,}} src={blacklogo}/>
                    </Link>
                </Grid>
                <Link to={`/login`} style={{ textDecoration: 'none' }}>
                <IconButton aria-label="delete">
                    <BiUser style = {{color: "black", margin: 10}}/>
                </IconButton>
                </Link>
            </Grid>
                </AppBar>
            <Grid
                direction="row"
                justify="flex-start"
                alignItems='center'
                container
                style = {{marginTop: 40}}
            >
                <Grid  item xs={12} sm = {12} md = {5} lg = {6} >
                    <Problem
                        setQuery = {setQuery}
                        isReturned = {isReturned}
                    />
                </Grid>
                <Grid item flexDirection="row" display = 'flex' xs={12} sm = {12} md = {7} lg = {6}>
                    <Box  style = {{height: '90vh', paddingTop: 40}} className={classes.inner_box}>
                        <Feed/>
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
        backgroundColor:'#FBFBFB',
        overflowX: 'hidden',
    },
    paper: {
        padding: theme.spacing(0),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },

    cursor:{
        color:"white"

    },

    typerWrapper:{
        color:"white",
        marginLeft: 65,
        marginBottom: 20,

    },

    box:{
        flexGrow: 1,
        padding: 0,
        // display: 'start',
        overflow: 'auto',
        flexDirection: 'column',
        // position: 'relative',
        overflowY: 'hidden',
        overflowX: 'hidden',
        // margin: 10,
        // marginBottom: 20,
        // backgroundColor: 'white',
    },


    inner_box:{
        flexGrow: 1,
        overflowY: 'scroll',
        overflowX: 'hidden',
        flexDirection: 'column',
        // backgroundColor: 'white',
        marginRight: -15
    },

}));

export default Home;




// {query ?
//
//     <Typewriter
//         wrapperClassName={classes.typerWrapper}
//         cursorClassNAme={classes.cursor}
//         style={{color: 'white'}}
//         options={{
//             strings: ['Interesting. Looking through our database to find matching categories...', 'Double checking previous search data..', 'Cross reference done. Submitted to a human for final approval...'],
//             autoStart: true,
//             loop: false,
//             delay: 40,
//             wrapperClassName: classes.typerWrapper,
//             deleteSpeed: 8,
//
//         }}
//     />
//
//     :null
// }


{/*    < Solution*/}
{/*query = {query}*/}
{/*parsedBody = {parsedBody}*/}
{/*response = {response}*/}
{/*/>*/}
{/*</Box>*/}
{/*</Grid>*/}



