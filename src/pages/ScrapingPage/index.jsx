import { FaAnglesRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import moment from "moment";

import Layout from "../../layouts"
import Input from "../../components/Input"
import BlueButton from "../../components/BlueButton"
import RedButton from "../../components/RedButton";
import ScrapItem from "../../components/ScrapItem";

import { db } from "../../lib/firebase";
import { doc, setDoc, collection, getDocs, serverTimestamp  } from "firebase/firestore";

const ScrapingPage = () => {

    const [url, setURL] = useState('');
    const [logs, setLogs] = useState([]);
    const [isScraping, setIsScraping] = useState(false);
    const [urls, setURLs] = useState([]);

    useEffect(()=>{
        async function fetchData() {
            const colRef = collection(db, "propertis");
            const snapshot = await getDocs(colRef);
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setURLs(list.map(item=>item.url));
        }
    
        fetchData();
    }, [])

    useEffect(()=>{
        console.log('urls ===> ', urls);
    }, [urls])

    const getRandomKey = (length) => {
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    const startScraping = async() =>{
        
        if(isScraping) return;

        const isValidURL = isValidUrl(url);

        if(!isValidURL) { 
            toast.warning("Please input valid URL !");
            return;
        }

        setIsScraping(true);

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/scrape`, {
            params: { url },
        })
        
        const resLogs = res.data.logs;

        resLogs.forEach(log => {
            if(urls.includes(log.url)) log['isSuccess'] = false;
            else {
                const key = getRandomKey(20);
                setDoc(doc(db, "propertis", key), {...log, time: moment().format("YYYY-MM-DD HH:mm:ss"), createdAt: serverTimestamp(),});
                setURLs([...urls, log.url]);
            }
        });

        const successLogsCount = resLogs.filter(log=>log.isSuccess).length;
        const failLogsCount = resLogs.length - successLogsCount;
        const key = getRandomKey(20);
        setDoc(doc(db, "logs", key), {success: successLogsCount, fail: failLogsCount, url, time: moment().format("YYYY-MM-DD HH:mm:ss"), createdAt: serverTimestamp()});
        
        setLogs(resLogs);
        setIsScraping(false);
    }

    const clear = () =>{
        setLogs([]);
        setURL('');
    }

    function isValidUrl(string) {
        try {
          new URL(string);
          return true;
        } catch (_) {
          return false;
        }
    }

    return (
        <Layout>
            <div className="w-full h-[calc(100%-114px)] flex flex-col !pt-[50px] items-center gap-[20px]">
                <div className="w-[90%] max-w-[700px] flex flex-col justify-start gap-[5px]">
                    <label htmlFor="url_input">URL</label>
                    <Input id={'url_input'} placeholder={'https://example.com/property/123'} value={url} handleOnChange={setURL} />
                </div>
                <div className="w-[90%] max-w-[700px]">
                    <BlueButton text={'Start'} icon={<FaAnglesRight />} handleOnClick={startScraping} isLoading={isScraping} classlist={'text-[20px]'} />
                </div>
                <div className="w-[90%] max-w-[700px] h-[calc(100%-170px)] bg-[#f7fcff] overflow-auto">
                    {
                        logs.map(log=><ScrapItem key={log.id} id={log.id} url={log.url} isSuccess={log.isSuccess} />)
                    }
                </div>
                <div className="w-[90%] max-w-[700px] flex flex-row-reverse gap-[10px]">
                    <div className="w-[100px]">
                        <RedButton text={'Clear'} icon={<></>} handleOnClick={clear} isLoading={false} />
                    </div>
                    <div className="flex flex-row justify-center items-center gap-[10px] text-[red]">
                        <IoClose /> 
                        <p>{logs.filter(log=>!log.isSuccess).length}</p>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-[10px] text-[green]">
                        <FaCheck /> 
                        <p>{logs.filter(log=>log.isSuccess).length}</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ScrapingPage