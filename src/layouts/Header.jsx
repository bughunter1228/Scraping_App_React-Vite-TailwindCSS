import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { TbZoomScan } from "react-icons/tb";
import { HiOutlineDatabase } from "react-icons/hi";
import { MdAccessTime } from "react-icons/md";

import HeaderButton from "../components/HeaderButton";

const Header = () => {
    const location = useLocation();

    const [currentPage, setCurrentPage] = useState('');

    useEffect(() => {
        setCurrentPage(location.pathname.split('/')[1] ?? '')
    }, [location])


    return (
        <div className="w-full h-[70px] bg-[#f7fcff] !border-[1px] !border-[#e2e8f0] flex flex-row justify-between items-center !pl-[100px] !pr-[100px]">
            <Link to='/'>
                <div className="flex flex-row justify-center items-center gap-[10px]">
                    <TbZoomScan size={40} color="#417df6" />
                    <h1 className="text-[20px] font-bold">PropScrapeAI</h1>
                </div>
            </Link>
            <div className="flex flex-row">
                <Link to='/'><HeaderButton icon={<TbZoomScan size={20} />} text={'Scrape'} selected={currentPage === ''} /></Link>
                <Link to='/database'><HeaderButton icon={<HiOutlineDatabase size={20} />} text={'Database'} selected={currentPage === 'database'} /></Link>
                <Link to='/log'><HeaderButton icon={<MdAccessTime size={20} />} text={'Log'} selected={currentPage === 'log'} /></Link>
            </div>
        </div>
    )
}

export default Header