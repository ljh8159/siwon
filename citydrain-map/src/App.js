import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';

import Home from './pages/Home';
import HomeHistory from './pages/HomeHistory';
import QrStart from './pages/QrStart';
import QrInput from './pages/QrInput';
import ReportPhoto from './pages/ReportPhoto';
import ReportConfirm from './pages/ReportConfirm';
import ReportComplete from './pages/ReportComplete';
import ReportsList from './pages/ReportsList';
import User from './pages/User';
import UserHistory from './pages/UserHistory';
import SafekoreaIframe from './pages/SafekoreaIframe';
import Admin from './pages/Admin';
import DispatchStart from './pages/DispatchStart';
import DispatchCleaning from './pages/DispatchCleaning';
import DispatchFinishConfirm from './pages/DispatchFinishConfirm';
import DispatchPhotoUpload from './pages/DispatchPhotoUpload';
import DispatchPhotoConfirm from './pages/DispatchPhotoConfirm';
import DispatchAiCheck from './pages/DispatchAiCheck';
import DispatchAiSuccess from './pages/DispatchAiSuccess';
import DispatchAiFail from './pages/DispatchAiFail';
import ReportResultStage1 from './pages/ReportResultStage1';
import ReportResultStage2 from './pages/ReportResultStage2';
import ReportResultStage3 from './pages/ReportResultStage3';
import ReportResultStage4 from './pages/ReportResultStage4';
import MapPage from './pages/MapPage';
import LoginPage from './components/LoginPage';
import SignupPage from './pages/SignupPage';

import config from './config';
const API_URL = config.API_URL;

function App() {
  const [stats, setStats] = useState({ blocked_count: 0, dispatched_count: 0 });
  const [homeReports, setHomeReports] = useState([]);
  const [allHomeReports, setAllHomeReports] = useState([]);
  const [userStats, setUserStats] = useState({ report_count: 0, dispatch_count: 0 });
  const [userReports, setUserReports] = useState([]);
  const [allUserReports, setAllUserReports] = useState([]);
  const [userPoint, setUserPoint] = useState(0);
  const [showAllReports, setShowAllReports] = useState(false);

  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [userId, setUserId] = useState(() => localStorage.getItem('user_id') || "guest");

  // 로그인 성공 시 호출
  const handleLoginSuccess = (token, user_id) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', user_id);
    setIsLoggedIn(true);
    setUserId(user_id);
  };

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    setIsLoggedIn(false);
    setUserId("guest");
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get(`${API_URL}/api/report_stats`);
        setStats(res.data);
      } catch (e) {
        setStats({ blocked_count: 0, dispatched_count: 0 });
      }
    }
    fetchStats();
  }, []);

  // 홈 신고/출동 이력 최신 3개
  useEffect(() => {
    async function fetchHomeReports() {
      try {
        const res = await axios.get(`${API_URL}/api/all_reports?limit=3`);
        setHomeReports(res.data);
      } catch (e) {
        setHomeReports([]);
      }
    }
    fetchHomeReports();
  }, []);

  // 홈 전체 신고/출동 이력 (더보기용)
  useEffect(() => {
    async function fetchAllHomeReports() {
      try {
        const res = await axios.get(`${API_URL}/api/all_reports?limit=100`);
        setAllHomeReports(res.data);
      } catch (e) {
        setAllHomeReports([]);
      }
    }
    fetchAllHomeReports();
  }, []);

  useEffect(() => {
    async function fetchUserStats() {
      try {
        const res = await axios.get(`${API_URL}/api/user_stats?user_id=${userId}`);
        setUserStats(res.data);
      } catch (e) {
        setUserStats({ report_count: 0, dispatch_count: 0 });
      }
    }
    fetchUserStats();
  }, [userId]);

  useEffect(() => {
    // 서비스 이용 이력(신고/출동 내역) 최신 3개 불러오기
    async function fetchUserReports() {
      try {
        const res = await axios.get(`${API_URL}/api/user_reports?user_id=${userId}&limit=3`);
        setUserReports(res.data);
      } catch (e) {
        setUserReports([]);
      }
    }
    fetchUserReports();
  }, [userId]);

  useEffect(() => {
    // 전체 서비스 이용 이력 불러오기 (더보기용)
    async function fetchAllUserReports() {
      try {
        const res = await axios.get(`${API_URL}/api/user_reports?user_id=${userId}&limit=100`);
        setAllUserReports(res.data);
      } catch (e) {
        setAllUserReports([]);
      }
    }
    fetchAllUserReports();
  }, [userId]);

  useEffect(() => {
    // 포인트 불러오기
    async function fetchUserPoint() {
      try {
        const res = await axios.get(`${API_URL}/api/user_point?user_id=${userId}`);
        setUserPoint(res.data.point);
      } catch (e) {
        setUserPoint(0);
      }
    }
    fetchUserPoint();
  }, [userId, userStats.report_count, userStats.dispatch_count]);

  // 실제 AI 서버에 예측 요청
  async function getAiStage(photoUrl) {
    try {
      const filename = photoUrl.split('/').pop();
      const res = await axios.post(`${API_URL}/api/predict`, { filename });
      return res.data.stage;
    } catch (e) {
      alert('AI 예측에 실패했습니다. 임의로 4단계로 이동합니다.');
      return 4;
    }
  }

  // DB 저장 함수
  async function saveReport({ user_id = "guest", type, photo_filename, location, lat, lng, timestamp, ai_stage, extra, dispatch_user_id, for_userpage_type, for_userpage_stage }) {
    try {
      await axios.post(`${API_URL}/api/report`, {
        user_id,
        type,
        photo_filename,
        location,
        lat,
        lng,
        timestamp,
        ai_stage,
        extra,
        dispatch_user_id,
        for_userpage_type,
        for_userpage_stage
      });
    } catch (e) {
      alert('DB 저장 실패');
    }
  }

  // 기존 신고를 출동/1단계로 업데이트
  async function updateReportToDispatch(location, dispatch_user_id) {
    try {
      await axios.post(`${API_URL}/api/report_update`, { location, dispatch_user_id });
    } catch (e) {
      alert('기존 신고 업데이트 실패');
    }
  }

  window.__qr_location = window.__qr_location || "";
  window.__qr_lat = window.__qr_lat || null;
  window.__qr_lng = window.__qr_lng || null;

  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={props =>
            isLoggedIn ? (
              <Home {...props} reports={homeReports} stats={stats} />
            ) : (
              <LoginPage {...props} setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />
            )
          }
        />
        <Route
          path="/login"
          render={props => (
            <LoginPage {...props} setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />
          )}
        />
        <Route
          path="/home/history"
          render={props =>
            isLoggedIn ? (
              <HomeHistory {...props} reports={allHomeReports} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          path="/user"
          exact
          render={props => (
            <User
              {...props}
              user={{
                name: userId,
                point: userPoint,
                reportCount: userStats.report_count,
                dispatchCount: userStats.dispatch_count,
                reports: userReports, // 최신 3개
              }}
              onLogout={handleLogout}
            />
          )}
        />
        <Route
          path="/user/history"
          render={props => (
            <UserHistory
              {...props}
              reports={allUserReports}
              userId={userId}
            />
          )}
        />
        <Route
          path="/signup"
          render={props => <SignupPage {...props} />}
        />
        <Route
          path="/qr_start"
          component={QrStart}
        />
        <Route
          path="/qr_input"
          render={props => (
            <QrInput
              {...props}
              onSubmit={data => {
                window.__qr_location = data.inputValue || "";
                window.__qr_type = data.qrType || "";
                window.__qr_lat = data.lat;
                window.__qr_lng = data.lng;
                if (data.qrType === "report") {
                  props.history.push("/report/photo", { lat: data.lat, lng: data.lng });
                } else if (data.qrType === "dispatch") {
                  props.history.push("/dispatch/start", { lat: data.lat, lng: data.lng });
                }
              }}
            />
          )}
        />
        <Route
          path="/report/photo"
          render={props => (
            <ReportPhoto
              {...props}
              lat={props.location.state?.lat}
              lng={props.location.state?.lng}
              onSubmit={(filename) => {
                const photoUrl = `${API_URL}/uploads/${filename}`;
                const location = window.__qr_location || "";
                const lat = window.__qr_lat;
                const lng = window.__qr_lng;
                props.history.push("/report/confirm", { photoUrl, location, lat, lng });
              }}
            />
          )}
        />
        <Route
          path="/report/confirm"
          render={props => (
            <ReportConfirm
              {...props}
              photoUrl={typeof props.location.state?.photoUrl === "string" ? props.location.state.photoUrl : ""}
              location={typeof props.location.state?.location === "string" ? props.location.state.location : ""}
              lat={props.location.state?.lat}
              lng={props.location.state?.lng}
              onSubmit={async (photoUrl, location, lat, lng) => {
                const stage = await getAiStage(photoUrl);
                const filename = photoUrl.split('/').pop();
                const timestamp = new Date().toISOString();
                await saveReport({
                  user_id: userId,
                  type: "신고",
                  photo_filename: filename,
                  location,
                  lat,
                  lng,
                  timestamp,
                  ai_stage: stage,
                  extra: "",
                  for_userpage_type: "신고",
                  for_userpage_stage: stage
                });
                if (stage === 3) {
                  props.history.push("/report/result_stage3", {
                    photoUrl,
                    location,
                  });
                } else if (stage === 1) props.history.push("/report/result_stage1");
                else if (stage === 2) props.history.push("/report/result_stage2");
                else props.history.push("/report/result_stage4");
              }}
              onRetry={() => props.history.push("/report/photo")}
            />
          )}
        />
        <Route
          path="/report/complete"
          render={props => (
            <ReportComplete
              {...props}
              photoUrl={props.location.state?.photoUrl}
              location={props.location.state?.location}
              completeTime={props.location.state?.completeTime}
              onNext={() => props.history.push("/")}
            />
          )}
        />
        <Route path="/reports/list" component={ReportsList} />
        <Route
          path="/admin"
          render={props => (
            <Admin
              {...props}
              reports={[]}
              onApprove={id => alert(`승인: ${id}`)}
            />
          )}
        />
        <Route
          path="/dispatch/start"
          render={props => (
            <DispatchStart
              {...props}
              onStart={() => props.history.push("/dispatch/cleaning")}
            />
          )}
        />
        <Route
          path="/dispatch/cleaning"
          render={props => (
            <DispatchCleaning
              {...props}
              onFinish={() => props.history.push("/dispatch/finish_confirm")}
            />
          )}
        />
        <Route
          path="/dispatch/finish_confirm"
          render={props => (
            <DispatchFinishConfirm
              {...props}
              onConfirm={() => props.history.push("/dispatch/photo_upload")}
            />
          )}
        />
        <Route
          path="/dispatch/photo_upload"
          render={props => (
            <DispatchPhotoUpload
              {...props}
              onSubmit={filename => {
                const photoUrl = `${API_URL}/uploads/${filename}`;
                props.history.push("/dispatch/photo_confirm", { photoUrl });
              }}
            />
          )}
        />
        <Route
          path="/dispatch/photo_confirm"
          render={props => (
            <DispatchPhotoConfirm
              {...props}
              photoUrl={props.location.state?.photoUrl}
              onConfirm={() => props.history.push("/dispatch/ai_check", { photoUrl: props.location.state?.photoUrl })}
              onRetry={() => props.history.push("/dispatch/photo_upload")}
            />
          )}
        />
        <Route
          path="/dispatch/ai_check"
          render={props => (
            <DispatchAiCheck
              {...props}
              onSuccess={async () => {
                const location = window.__qr_location || "";
                await updateReportToDispatch(location, userId); // dispatch_user_id 전달
                props.history.push("/dispatch/ai_success");
              }}
              onFail={async () => {
                const photoUrl = props.location.state?.photoUrl;
                const filename = photoUrl ? photoUrl.split('/').pop() : "";
                const location = window.__qr_location || "";
                const lat = window.__qr_lat;
                const lng = window.__qr_lng;
                const timestamp = new Date().toISOString();
                await saveReport({
                  user_id: userId,
                  type: "출동",
                  photo_filename: filename,
                  location,
                  lat,
                  lng,
                  timestamp,
                  ai_stage: 4,
                  extra: "",
                  for_userpage_type: "출동",
                  for_userpage_stage: 4
                });
                props.history.push("/dispatch/ai_fail");
              }}
            />
          )}
        />
        <Route
          path="/dispatch/ai_success"
          render={props => (
            <DispatchAiSuccess
              {...props}
              onNext={() => props.history.push("/")}
            />
          )}
        />
        <Route
          path="/dispatch/ai_fail"
          render={props => (
            <DispatchAiFail
              {...props}
              onRetry={() => props.history.push("/dispatch/photo_upload")}
            />
          )}
        />
        <Route
          path="/report/result_stage1"
          render={props => (
            <ReportResultStage1
              {...props}
              onNext={() => props.history.push("/report/result_stage2")}
            />
          )}
        />
        <Route
          path="/report/result_stage2"
          render={props => (
            <ReportResultStage2
              {...props}
              onNext={() => props.history.push("/report/result_stage3")}
            />
          )}
        />
        <Route
          path="/report/result_stage3"
          render={props => (
            <ReportResultStage3
              {...props}
              photoUrl={props.location.state?.photoUrl}
              location={props.location.state?.location}
              onNext={() => {
                const completeTime = new Date().toISOString();
                const { photoUrl, location } = props.location.state || {};
                props.history.push("/report/complete", {
                  photoUrl,
                  location,
                  completeTime,
                });
              }}
            />
          )}
        />
        <Route
          path="/report/result_stage4"
          render={props => (
            <ReportResultStage4
              {...props}
              onNext={() => props.history.push("/")}
            />
          )}
        />
        <Route path="/map" component={MapPage} />
      </Switch>
    </Router>
  );
}

export default App;