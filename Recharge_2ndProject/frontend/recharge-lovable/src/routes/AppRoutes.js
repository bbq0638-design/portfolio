import React from "react";
import{Routes, Route} from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import FindChargerLogin from "../components/findcharger/FIndChargerLogin";
import FindChargerLogout from "../components/findcharger/FindChargerLogout";
import FindChargerResult from "../components/findcharger/FindChargerResult";
import SearchBar from "../components/findcharger/SearchBar";
import Login from "../components/auth/Login";
import FindId from "../components/auth/FindId";
import FindIdResult from "../components/auth/FindIdResult";
import FindPwd from "../components/auth/FindPwd";
import FindPwdResult from "../components/auth/FindPwdResult";
import SignUp from "../components/auth/SIgnUp";
import SignResult from "../components/auth/SignResult";
import TermsAgreement from "../components/auth/TermsAgreement";
import Fortune from "../components/fortune/Fortune";
import Bookmark from"../components/auth/Bookmark";
import Mypage from "../components/auth/Mypage";
import FindMovie from "../components/findcontents/movie/FindMovie";
import FindMusic from "../components/findcontents/music/FindMusic";
import AddMovie from "../components/findcontents/movie/AddMovie";
import AddMusic from "../components/findcontents/music/AddMusic";
import UserMovieDetail from "../components/findcontents/movie/UserMovieDetail";
import UserMusicDetail from "../components/findcontents/music/UserMusicDetail";
import MovieDetail from "../components/findcontents/movie/MovieDetail";
import Community from "../components/community/Community";
import CommunityDetailPage from "../components/community/CommunityDetailPage";
import CommunityWritePage from "../components/community/CommunityWritePage";
import Notice from "../components/notice/Notice";
import NoticeDetailPage from "../components/notice/NoticeDetailPage";
import ModifyPwd from "../components/auth/ModifyPwd";
import NoticeBoard from "../components/admin/NoticeBoard";
import NoticeManagement from "../components/admin/NoticeManagement";
import ReportManagement from "../components/admin/ReportManagement";
import KakaoMapTest from "../pages/KakaoMapTest";


function AppRoutes(){
  const{isLogin, isLoading} = useAuth();

  return (
    <div className="app_wrapper">
      <Header/>
      <div className="app_main">
        <Routes>
          <Route path="/" element={isLoading ? null : isLogin ? <FindChargerLogin/> : <FindChargerLogout />} />
          <Route path="/find_charger" element={<FindChargerLogin />} />
          <Route path="/find_charger_result" element={<FindChargerResult />} />
          <Route path="/search" element={<SearchBar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/findid" element={<FindId />} />
          <Route path="/findid_result" element={<FindIdResult />} />
          <Route path="/findpwd" element={<FindPwd />} />
          <Route path="/findpwd_result" element={<FindPwdResult />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup_result" element={<SignResult />} />
          <Route path="/agreement" element={<TermsAgreement />} />
          <Route path="/fortune" element={<Fortune />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/find_contents/movie" element={<FindMovie/>} />
          <Route path="/find_contents/music" element={<FindMusic/>} />
          <Route path="/find_contents/movie/addmovie" element={<AddMovie/>} />
          <Route path="/find_contents/music/addmusic" element={<AddMusic/>} />
          <Route path="/find_contents/movie/posts/:postId" element={<UserMovieDetail/>} />
          <Route path="/find_contents/music/usermusicdetail/:postId" element={<UserMusicDetail/>} />
          <Route path="/find_contents/movie/:movieId" element={<MovieDetail/>} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/detail/:id" element={<CommunityDetailPage />} />
          <Route path="/community/write" element={<CommunityWritePage />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/notice/detail/:id" element={<NoticeDetailPage />} />
          <Route path="/modifypwd" element={<ModifyPwd/>} />
          <Route path= "/admin/noticeboard" element={<NoticeBoard />} />
          <Route path="/admin/noticeboard/:id" element={<NoticeBoard />} />
          <Route path= "/admin/noticemanage" element={<NoticeManagement />} />
          <Route path="/admin/reportmanage" element={<ReportManagement />} />
          <Route path="/test-map" element={<KakaoMapTest />} /> 
        </Routes>
      </div>
    </div>
  );
}

export default AppRoutes;