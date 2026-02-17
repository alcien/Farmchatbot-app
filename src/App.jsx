import React, { useState, useRef, useEffect } from 'react';

const FarmingAIChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [profileData, setProfileData] = useState({
    farmName: '', location: '', farmSize: '', soilType: '',
    mainCrops: [], experience: '', facilities: []
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const frequentQuestions = [
    '내 농지에 적합한 작물을 추천해주세요',
    '병충해 진단을 받고 싶어요',
    '이번 달 농사 일정이 궁금해요',
    '농자재 구입처를 알려주세요'
  ];

  const quickCategories = [
    { id: 'crop', label: '작물 추천', icon: '🌾', color: '#4CAF50' },
    { id: 'weather', label: '기상 정보', icon: '🌤️', color: '#2196F3' },
    { id: 'pest', label: '병해충', icon: '🐛', color: '#FF9800' },
    { id: 'calendar', label: '영농 일정', icon: '📅', color: '#9C27B0' },
    { id: 'market', label: '시세 정보', icon: '📊', color: '#E91E63' },
    { id: 'localfood', label: '로컬푸드', icon: '🛒', color: '#00BCD4' }
  ];

  const infoCategories = [
    { id: 'crop_info', label: '작물 안내', icon: '🌱', color: '#66BB6A' },
    { id: 'weather_info', label: '날씨 안내', icon: '☀️', color: '#42A5F5' },
    { id: 'pest_info', label: '병해충 안내', icon: '🔬', color: '#FFA726' },
    { id: 'calendar_info', label: '일정 안내', icon: '🗓️', color: '#AB47BC' },
    { id: 'market_info', label: '시세 안내', icon: '📈', color: '#EC407A' },
    { id: 'subsidy_info', label: '보조금 안내', icon: '💰', color: '#26C6DA' }
  ];

  const cropOptions = ['벼', '배추', '무', '고추', '마늘', '양파', '감자', '토마토', '딸기', '사과'];
  const facilityOptions = ['비닐하우스', '유리온실', '저온저장고', '건조기', '트랙터', '콤바인', '관개시설', '스마트팜'];

  const sampleResponses = {
    crop: {
      title: '🌾 작물 추천 안내',
      content: `회원님의 농지 정보를 기반으로 추천드립니다.

**추천 작물**
• **배추** - 현재 토양 상태와 기후에 적합
• **무** - 가을철 재배 최적기
• **시금치** - 단기 수확 가능

**참고 정보**
• 토양 산도: pH 6.2 (적정)
• 예상 수확시기: 11월 중순

더 자세한 분석이 필요하시면 '토양 분석 요청'을 말씀해주세요.`,
      links: ['토양 분석 요청', '작물별 재배법 보기']
    },
    pest: {
      title: '🐛 병해충 진단 안내',
      content: `병해충 진단을 도와드리겠습니다.

**진단 방법**
1. 피해 증상이 있는 작물 사진을 올려주세요
2. 증상이 나타난 부위를 알려주세요
3. 발생 시기와 범위를 말씀해주세요

**자주 발생하는 병해충**
• 배추: 배추좀나방, 무름병
• 고추: 탄저병, 진딧물

사진을 업로드하시면 AI가 즉시 분석해드립니다.`,
      links: ['사진 업로드', '방제 약품 조회']
    },
    calendar: {
      title: '📅 영농 일정 안내',
      content: `이번 달 주요 영농 일정을 안내드립니다.

**2월 주요 일정**
• 2/15 - 봄 감자 파종 준비
• 2/20 - 시금치 파종 적기
• 2/22 - 병해충 예방 방제
• 2/28 - 토양 검정 신청 마감

**권장 작업**
• 비닐하우스 환기 점검
• 과수원 전정 작업

알림 설정을 하시면 일정 3일 전에 푸시 알림을 받으실 수 있습니다.`,
      links: ['알림 설정', '월별 일정 보기']
    },
    material: {
      title: '🏪 농자재 구입처 안내',
      content: `회원님 지역 기준 농자재 구입처를 안내드립니다.

**가까운 농자재 판매점**
• 화성농협 농자재마트 (2.3km)
• 봉담 종묘사 (3.1km)
• 스마트팜 자재센터 (4.8km)

**온라인 구매처**
• 농협몰 (무료배송)
• 팜모닝 (당일배송 가능)

필요한 농자재 종류를 말씀해주시면 더 자세히 안내드리겠습니다.`,
      links: ['비료 구입처', '종자 구입처', '농기계 대여']
    },
    default: {
      title: '📋 안내',
      content: `말씀하신 내용을 확인했습니다.

해당 문의에 대해 도움을 드리겠습니다. 더 자세한 내용이 필요하시면 말씀해주세요.`,
      links: ['상담원 연결', '관련 정보 더 보기']
    }
  };

  const handleSendMessage = async (text = inputValue) => {
    if (!text.trim()) return;
    const userMessage = { id: Date.now(), type: 'user', content: text, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setCurrentView('chat');
    setTimeout(() => {
      let response = sampleResponses.default;
      if (text.includes('작물') || text.includes('추천')) {
        response = sampleResponses.crop;
      } else if (text.includes('병') || text.includes('충') || text.includes('진단')) {
        response = sampleResponses.pest;
      } else if (text.includes('일정') || text.includes('농사')) {
        response = sampleResponses.calendar;
      } else if (text.includes('농자재') || text.includes('구입')) {
        response = sampleResponses.material;
      }
      const botMessage = { id: Date.now() + 1, type: 'bot', title: response.title, content: response.content, links: response.links, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleBack = () => { setCurrentView('home'); setMessages([]); };

  // 기상 정보 안내 화면
  const WeatherView = () => {
    const weekData = [
      { day: '월', icon: '☀️', high: 22, low: 14 },
      { day: '화', icon: '🌤️', high: 24, low: 15 },
      { day: '수', icon: '🌧️', high: 19, low: 13 },
      { day: '목', icon: '🌧️', high: 18, low: 12 },
      { day: '금', icon: '⛅', high: 23, low: 14 },
      { day: '토', icon: '☀️', high: 25, low: 16 },
      { day: '일', icon: '☀️', high: 26, low: 17 }
    ];
    return (
      <div style={{ padding: '20px', overflow: 'auto', height: '100%' }}>
        <div style={{ background: 'linear-gradient(135deg, #4FC3F7 0%, #03A9F4 100%)', borderRadius: '24px', padding: '24px', color: 'white', marginBottom: '16px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '10px', right: '20px', fontSize: '60px', opacity: '0.3' }}>☀️</div>
          <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>경기도 화성시 • 오늘</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', margin: '8px 0' }}>
            <span style={{ fontSize: '56px', fontWeight: '300', lineHeight: 1 }}>21°</span>
            <div style={{ paddingBottom: '8px' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>맑음</p>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.8 }}>체감 19°</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px', flexWrap: 'wrap' }}>
            <span>💧 습도 55%</span><span>💨 바람 3m/s</span><span>🌡️ 최고 24° / 최저 14°</span>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '20px', padding: '20px', marginBottom: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#333' }}>📊 주간 기온 추이</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '120px' }}>
            {weekData.map((d, idx) => {
              const barHeight = ((d.high - 10) / 20) * 80;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>{d.high}°</span>
                  <div style={{ width: '24px', height: `${barHeight}px`, background: d.icon.includes('🌧') ? 'linear-gradient(180deg, #90CAF9, #42A5F5)' : 'linear-gradient(180deg, #FFE082, #FFB74D)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '4px' }}>
                    <span style={{ fontSize: '12px' }}>{d.icon}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#999' }}>{d.low}°</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: idx === 0 ? '#4CAF50' : '#666' }}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #FFF8E1, #FFECB3)', borderRadius: '16px', padding: '16px', border: '1px solid #FFE082' }}>
          <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#F57C00' }}>⚠️ 농업 기상 특보</h4>
          <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#666' }}>• <strong>수~목 강우 예상</strong> - 배수로 점검 권장</p>
          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>• <strong>일교차 10°C 이상</strong> - 냉해 주의</p>
        </div>
      </div>
    );
  };

  // 날씨 안내 화면 (정보형)
  const WeatherInfoView = () => {
    const weekData = [
      { day: '월', icon: '☀️', high: 22, low: 14 },
      { day: '화', icon: '🌤️', high: 24, low: 15 },
      { day: '수', icon: '🌧️', high: 19, low: 13 },
      { day: '목', icon: '🌧️', high: 18, low: 12 },
      { day: '금', icon: '⛅', high: 23, low: 14 },
      { day: '토', icon: '☀️', high: 25, low: 16 },
      { day: '일', icon: '☀️', high: 26, low: 17 }
    ];
    return (
      <div style={{ padding: '20px', overflow: 'auto', height: '100%' }}>
        <div style={{ background: 'linear-gradient(135deg, #4FC3F7 0%, #03A9F4 100%)', borderRadius: '24px', padding: '24px', color: 'white', marginBottom: '16px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '10px', right: '20px', fontSize: '60px', opacity: '0.3' }}>☀️</div>
          <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>경기도 화성시 • 오늘</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', margin: '8px 0' }}>
            <span style={{ fontSize: '56px', fontWeight: '300', lineHeight: 1 }}>21°</span>
            <div style={{ paddingBottom: '8px' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>맑음</p>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.8 }}>체감 19°</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px', flexWrap: 'wrap' }}>
            <span>💧 습도 55%</span><span>💨 바람 3m/s</span><span>🌡️ 최고 24° / 최저 14°</span>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '20px', padding: '20px', marginBottom: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#333' }}>📊 주간 기온 추이</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '120px' }}>
            {weekData.map((d, idx) => {
              const barHeight = ((d.high - 10) / 20) * 80;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '11px', color: '#666' }}>{d.high}°</span>
                  <div style={{ width: '24px', height: `${barHeight}px`, background: d.icon.includes('🌧') ? 'linear-gradient(180deg, #90CAF9, #42A5F5)' : 'linear-gradient(180deg, #FFE082, #FFB74D)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '4px' }}>
                    <span style={{ fontSize: '12px' }}>{d.icon}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#999' }}>{d.low}°</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: idx === 0 ? '#4CAF50' : '#666' }}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #FFF8E1, #FFECB3)', borderRadius: '16px', padding: '16px', border: '1px solid #FFE082' }}>
          <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#F57C00' }}>⚠️ 농업 기상 특보</h4>
          <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#666' }}>• <strong>수~목 강우 예상</strong> - 배수로 점검 권장</p>
          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>• <strong>일교차 10°C 이상</strong> - 냉해 주의</p>
        </div>
      </div>
    );
  };

  // 시세 정보 안내 화면 (알림톡 스타일)
  const MarketView = () => {
    const [chatMessages, setChatMessages] = useState([
      { id: 1, type: 'bot', content: '박농부님, 현재 고추 시세가 아주 좋습니다! 🌶️📈\n\n지금 kg당 12,000원으로 이번 달 최고가를 기록 중이에요.\n\n이번 주에 로컬푸드 매장에 출하하실 계획이 있으신가요?', buttons: ['네, 출하할 계획이에요', '아니요, 좀 더 기다릴게요'], time: '오전 08:30' }
    ]);
    const [inputVal, setInputVal] = useState('');
    const [showInput, setShowInput] = useState(false);

    const handleButtonClick = (btn) => {
      setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', content: btn, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
      setTimeout(() => {
        if (btn.includes('출하할')) {
          setShowInput(true);
          setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: '좋은 타이밍이에요! 💰\n\n출하 예정 수량을 알려주시면 예상 수익을 계산해드릴게요.\n\n💬 예: "내일 50박스 낼 거야", "이번 주에 100kg 출하 예정"', time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        } else {
          setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: '알겠습니다! 📊\n\n시세 변동이 있으면 바로 알려드릴게요.\n참고로 전문가들은 이번 주 말까지는 현재 가격이 유지될 것으로 예상하고 있어요.\n\n다른 작물 시세도 확인하시겠어요?', buttons: ['다른 작물 시세 보기', '메인으로 돌아가기'], time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        }
      }, 800);
    };

    const handleSendChat = () => {
      if (!inputVal.trim()) return;
      const text = inputVal;
      setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', content: text, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
      setInputVal('');
      setTimeout(() => {
        const match = text.match(/(\d+)/);
        const qty = match ? match[1] : '50';
        setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: `네! 출하량 ${qty}박스를 대시보드에 반영했습니다. 📊\n\n💵 예상 수익: 약 ${(parseInt(qty) * 12000 * 5).toLocaleString()}원\n📅 출하 예정일: 내일\n📍 추천 판매처: 화성 로컬푸드 직매장\n\n출하 완료 후 알려주시면 실제 수익을 기록해드릴게요!`, buttons: ['출하 완료 알림 받기', '메인으로 돌아가기'], time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
      }, 800);
    };

    return (
      <div style={{ padding: '16px', overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          {chatMessages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: '16px' }}>
              {msg.type === 'bot' ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', background: 'linear-gradient(180deg, #E91E63, #C2185B)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📊</div>
                  <div style={{ maxWidth: '80%' }}>
                    <span style={{ fontSize: '10px', color: '#999', marginBottom: '4px', display: 'block' }}>{msg.time}</span>
                    <div style={{ background: 'white', padding: '14px', borderRadius: '4px 16px 16px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: '#333', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{msg.content}</p>
                    </div>
                    {msg.buttons && (
                      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {msg.buttons.map((btn, idx) => (
                          <button key={idx} onClick={() => btn === '메인으로 돌아가기' ? setCurrentView('home') : handleButtonClick(btn)} style={{ background: 'white', border: '1.5px solid #E91E63', borderRadius: '20px', padding: '10px 16px', fontSize: '13px', color: '#E91E63', fontWeight: '500', cursor: 'pointer', textAlign: 'left' }}>
                            {btn}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ maxWidth: '75%' }}>
                    <span style={{ fontSize: '10px', color: '#999', marginBottom: '4px', display: 'block', textAlign: 'right' }}>{msg.time}</span>
                    <div style={{ background: 'linear-gradient(135deg, #E91E63, #F06292)', color: 'white', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', fontSize: '13px' }}>{msg.content}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {showInput && (
          <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid #e0e0e0' }}>
            <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendChat()} placeholder="출하 수량을 입력하세요..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '20px', fontSize: '13px', outline: 'none' }} />
            <button onClick={handleSendChat} style={{ background: '#E91E63', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' }}>➤</button>
          </div>
        )}
      </div>
    );
  };

  // 작물 추천 안내 화면 (알림톡 스타일)
  const CropRecommendView = () => {
    const [chatMessages, setChatMessages] = useState([
      { id: 1, type: 'bot', content: '김농부님, 지난번에 심으신 \'봄배추\' 수확 시기가 다가왔습니다. 🥬\n\n파종일로부터 60일이 지났어요. 수확을 완료하셨나요?', buttons: ['네, 수확 완료했습니다', '아니요, 1주일 뒤에 할 예정입니다'], time: '오전 09:00' }
    ]);
    const [inputVal, setInputVal] = useState('');
    const [showInput, setShowInput] = useState(false);

    const handleButtonClick = (btn) => {
      setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', content: btn, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
      setTimeout(() => {
        if (btn.includes('완료')) {
          setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: '수확 완료 처리되었습니다! 🎉\n\n📊 대시보드에 \'배추 재배 완료\'로 기록했어요.\n💰 예상 수익 계산을 시작합니다.\n\n다음 작기에는 무엇을 심으실 계획인가요?', buttons: ['시금치 추천받기', '다른 작물 보기'], time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        } else {
          setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: '알겠습니다! 📅\n\n수확 예정일을 2월 22일로 연기해두었어요.\n해당 날짜에 다시 알림을 보내드릴게요.\n\n수확 전 체크리스트도 보내드릴까요?', buttons: ['네, 체크리스트 보내주세요', '괜찮아요'], time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        }
      }, 800);
    };

    const handleSendChat = () => {
      if (!inputVal.trim()) return;
      setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', content: inputVal, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
      const text = inputVal;
      setInputVal('');
      setTimeout(() => {
        setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: `"${text}" 관련 정보를 확인했습니다.\n\n해당 내용을 대시보드에 반영해두었어요. 더 필요한 것이 있으시면 말씀해주세요! 😊`, buttons: ['메인으로 돌아가기'], time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
      }, 800);
    };

    return (
      <div style={{ padding: '16px', overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          {chatMessages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: '16px' }}>
              {msg.type === 'bot' ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', background: 'linear-gradient(180deg, #8BC34A, #689F38)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🌾</div>
                  <div style={{ maxWidth: '80%' }}>
                    <span style={{ fontSize: '10px', color: '#999', marginBottom: '4px', display: 'block' }}>{msg.time}</span>
                    <div style={{ background: 'white', padding: '14px', borderRadius: '4px 16px 16px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: '#333', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{msg.content}</p>
                    </div>
                    {msg.buttons && (
                      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {msg.buttons.map((btn, idx) => (
                          <button key={idx} onClick={() => btn === '메인으로 돌아가기' ? setCurrentView('home') : handleButtonClick(btn)} style={{ background: 'white', border: '1.5px solid #4CAF50', borderRadius: '20px', padding: '10px 16px', fontSize: '13px', color: '#4CAF50', fontWeight: '500', cursor: 'pointer', textAlign: 'left' }}>
                            {btn}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ maxWidth: '75%' }}>
                    <span style={{ fontSize: '10px', color: '#999', marginBottom: '4px', display: 'block', textAlign: 'right' }}>{msg.time}</span>
                    <div style={{ background: 'linear-gradient(135deg, #4CAF50, #66BB6A)', color: 'white', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', fontSize: '13px' }}>{msg.content}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {showInput && (
          <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid #e0e0e0' }}>
            <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendChat()} placeholder="메시지를 입력하세요..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '20px', fontSize: '13px', outline: 'none' }} />
            <button onClick={handleSendChat} style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' }}>➤</button>
          </div>
        )}
      </div>
    );
  };

  // 병해충 안내 화면 (알림톡 스타일)
  const PestView = () => {
    const [chatMessages, setChatMessages] = useState([
      { id: 1, type: 'bot', content: '이농부님, 3일 전 안내해드린 무름병 예방 약제는 살포하셨나요? 🌿\n\n현재 회원님 지역의 무름병 위험도가 \'높음\'으로 유지되고 있어요.', buttons: ['오늘 살포 완료', '아직 안 했어요'], time: '오전 10:15' }
    ]);
    const [inputVal, setInputVal] = useState('');
    const [showInput, setShowInput] = useState(false);

    const handleButtonClick = (btn) => {
      setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', content: btn, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
      setTimeout(() => {
        if (btn.includes('완료')) {
          setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: '방제 완료 처리했습니다! ✅\n\n📋 2월 15일 방제 이력이 추가되었어요.\n⏰ 14일 뒤(3월 1일) 2차 방제 알림을 자동 예약했습니다.\n\n다음 방제까지 작물 상태를 잘 관찰해주세요!', buttons: ['방제 이력 보기', '메인으로 돌아가기'], time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        } else if (btn.includes('안 했')) {
          setShowInput(true);
          setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: '아직 방제를 못 하셨군요.\n\n혹시 어려운 점이 있으신가요? 말씀해주시면 도움을 드릴게요.\n\n💬 예: "농약 뭘 써야 할지 모르겠어", "시간이 없었어"', time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        } else if (btn === '메인으로 돌아가기') {
          setCurrentView('home');
        }
      }, 800);
    };

    const handleSendChat = () => {
      if (!inputVal.trim()) return;
      const text = inputVal;
      setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', content: text, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
      setInputVal('');
      setTimeout(() => {
        if (text.includes('농약') || text.includes('뭘')) {
          setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: '무름병 예방에는 다음 약제를 추천드려요:\n\n• 코사이드 (구리 수화제) - 예방용\n• 다코닐 - 발병 초기\n• 스트렙토마이신 - 세균성\n\n가까운 화성농협에서 구입 가능합니다. 📍', buttons: ['구입처 안내받기', '방제 일정 잡기'], time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        } else {
          setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: `"${text}" 내용을 확인했습니다.\n\n내일 오전 중으로 방제하시는 게 좋을 것 같아요. 리마인드 알림을 설정해드릴까요?`, buttons: ['내일 알림 설정', '괜찮아요'], time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        }
      }, 800);
    };

    return (
      <div style={{ padding: '16px', overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          {chatMessages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: '16px' }}>
              {msg.type === 'bot' ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', background: 'linear-gradient(180deg, #FF9800, #F57C00)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🐛</div>
                  <div style={{ maxWidth: '80%' }}>
                    <span style={{ fontSize: '10px', color: '#999', marginBottom: '4px', display: 'block' }}>{msg.time}</span>
                    <div style={{ background: 'white', padding: '14px', borderRadius: '4px 16px 16px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: '#333', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{msg.content}</p>
                    </div>
                    {msg.buttons && (
                      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {msg.buttons.map((btn, idx) => (
                          <button key={idx} onClick={() => handleButtonClick(btn)} style={{ background: 'white', border: '1.5px solid #FF9800', borderRadius: '20px', padding: '10px 16px', fontSize: '13px', color: '#FF9800', fontWeight: '500', cursor: 'pointer', textAlign: 'left' }}>
                            {btn}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ maxWidth: '75%' }}>
                    <span style={{ fontSize: '10px', color: '#999', marginBottom: '4px', display: 'block', textAlign: 'right' }}>{msg.time}</span>
                    <div style={{ background: 'linear-gradient(135deg, #FF9800, #FFB74D)', color: 'white', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', fontSize: '13px' }}>{msg.content}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {showInput && (
          <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid #e0e0e0' }}>
            <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendChat()} placeholder="메시지를 입력하세요..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '20px', fontSize: '13px', outline: 'none' }} />
            <button onClick={handleSendChat} style={{ background: '#FF9800', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' }}>➤</button>
          </div>
        )}
      </div>
    );
  };

  // 영농 일정 안내 화면
  const CalendarView = () => {
    const tasks = [
      { date: '2/15', task: '봄 감자 파종 준비', type: '파종', color: '#4CAF50' },
      { date: '2/18', task: '과수원 전정 작업', type: '관리', color: '#2196F3' },
      { date: '2/20', task: '시금치 파종 적기', type: '파종', color: '#4CAF50' },
      { date: '2/22', task: '병해충 예방 방제', type: '방제', color: '#FF9800' },
      { date: '2/28', task: '토양 검정 신청 마감', type: '행정', color: '#9C27B0' }
    ];
    return (
      <div style={{ padding: '20px', overflow: 'auto', height: '100%' }}>
        <div style={{ background: 'linear-gradient(135deg, #E8EAF6, #C5CAE9)', borderRadius: '20px', padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>📅</div>
          <h3 style={{ margin: '0 0 8px', color: '#3F51B5', fontSize: '18px' }}>2월 영농 일정</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#5C6BC0' }}>이번 달 주요 농사 일정을 확인하세요</p>
        </div>
        <div style={{ background: 'white', borderRadius: '20px', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          {tasks.map((task, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: idx < tasks.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{ minWidth: '45px', textAlign: 'center' }}><p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#333' }}>{task.date}</p></div>
              <div style={{ width: '4px', height: '36px', background: task.color, borderRadius: '2px' }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '500', color: '#333' }}>{task.task}</p>
                <span style={{ background: `${task.color}15`, color: task.color, padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '500' }}>{task.type}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '16px', background: '#E8F5E9', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🔔</span>
          <p style={{ margin: 0, fontSize: '12px', color: '#2E7D32' }}><strong>알림 설정:</strong> 중요 일정 3일 전 푸시 알림을 받으세요</p>
        </div>
      </div>
    );
  };

  // 로컬푸드 파종 추천 화면 (알림톡 스타일)
  const LocalFoodView = () => {
    const [chatMessages, setChatMessages] = useState([
      { id: 1, type: 'bot', content: '김농부님, 좋은 소식이 있어요! 🛒✨\n\n화성 로컬푸드 직매장에서 3~4월 수요 예측 데이터가 나왔는데요,\n\n📈 수요 급등 예상 품목:\n• 쪽파 (+180% 예상)\n• 시금치 (+150% 예상)\n• 봄동 (+120% 예상)\n\n회원님 농지 조건을 분석해보니, 지금 파종하시면 딱 맞춰서 출하 가능해요!', buttons: ['자세히 알려줘', '다른 품목도 볼래요'], time: '오전 08:00' }
    ]);
    const [inputVal, setInputVal] = useState('');
    const [showInput, setShowInput] = useState(false);

    const handleButtonClick = (btn) => {
      setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', content: btn, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
      setTimeout(() => {
        if (btn.includes('자세히')) {
          setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: '🥬 쪽파 파종을 추천드려요!\n\n📊 추천 이유:\n• 3월 중순 로컬푸드 수요 180% 급등 예상\n• 회원님 농지(화성시) 토양 적합도 95%\n• 현재 파종 시 45일 후 수확 → 수요 피크와 딱 맞음!\n\n💰 예상 수익:\n• 100평 기준 약 150만원\n• 현재 시세 대비 +30% 프리미엄 예상\n\n지금 파종 준비하시겠어요?', buttons: ['좋아, 쪽파 심을게!', '다른 작물도 추천해줘', '고민해볼게'], time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        } else if (btn.includes('다른 품목') || btn.includes('다른 작물')) {
          setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: '다른 추천 작물도 알려드릴게요! 🌱\n\n🥬 시금치 (추천도 ⭐⭐⭐⭐)\n• 4월 초 수요 150% 증가 예상\n• 파종 후 30일 수확\n• 예상 수익: 100평당 80만원\n\n🥬 봄동 (추천도 ⭐⭐⭐)\n• 3월 말 수요 120% 증가\n• 파종 후 40일 수확\n• 예상 수익: 100평당 100만원\n\n어떤 작물이 끌리세요?', buttons: ['시금치로 할게', '봄동으로 할게', '쪽파가 제일 좋을 것 같아'], time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        } else if (btn.includes('쪽파') || btn.includes('시금치') || btn.includes('봄동')) {
          const crop = btn.includes('쪽파') ? '쪽파' : btn.includes('시금치') ? '시금치' : '봄동';
          setShowInput(true);
          setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: `${crop} 선택하셨군요! 좋은 선택이에요! 🎯\n\n파종 계획을 등록해드릴게요.\n몇 평 정도 심으실 예정인가요?\n\n💬 예: "100평", "200평 정도", "300평 심을 거야"`, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        } else if (btn.includes('고민')) {
          setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: '천천히 고민해보세요! 😊\n\n참고로 쪽파 파종 최적 시기는 이번 주까지예요.\n결정하시면 언제든 말씀해주세요!\n\n로컬푸드 수요 예측은 매주 월요일에 업데이트됩니다.', buttons: ['메인으로 돌아가기'], time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        } else if (btn === '메인으로 돌아가기' || btn === '대시보드 확인하기') {
          setCurrentView('home');
        }
      }, 800);
    };

    const handleSendChat = () => {
      if (!inputVal.trim()) return;
      const text = inputVal;
      setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', content: text, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
      setInputVal('');
      setTimeout(() => {
        const match = text.match(/(\d+)/);
        const area = match ? match[1] : '100';
        const revenue = (parseInt(area) * 15000).toLocaleString();
        setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: `${area}평 파종 계획 등록 완료! ✅\n\n📋 등록된 계획:\n• 작물: 쪽파\n• 면적: ${area}평\n• 파종 예정일: 2월 17일 (내일)\n• 수확 예정일: 4월 3일\n• 예상 수익: 약 ${revenue}원\n\n🛒 로컬푸드 직매장 출하 예약도 해드릴까요?\n수요 피크 시기에 맞춰 자동으로 알림 보내드릴게요!`, buttons: ['출하 예약할게요', '나중에 할게요', '대시보드 확인하기'], time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        setShowInput(false);
      }, 800);
    };

    return (
      <div style={{ padding: '16px', overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          {chatMessages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: '16px' }}>
              {msg.type === 'bot' ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', background: 'linear-gradient(180deg, #00BCD4, #0097A7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🛒</div>
                  <div style={{ maxWidth: '80%' }}>
                    <span style={{ fontSize: '10px', color: '#999', marginBottom: '4px', display: 'block' }}>{msg.time}</span>
                    <div style={{ background: 'white', padding: '14px', borderRadius: '4px 16px 16px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: '#333', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{msg.content}</p>
                    </div>
                    {msg.buttons && (
                      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {msg.buttons.map((btn, idx) => (
                          <button key={idx} onClick={() => handleButtonClick(btn)} style={{ background: 'white', border: '1.5px solid #00BCD4', borderRadius: '20px', padding: '10px 16px', fontSize: '13px', color: '#00BCD4', fontWeight: '500', cursor: 'pointer', textAlign: 'left' }}>
                            {btn}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ maxWidth: '75%' }}>
                    <span style={{ fontSize: '10px', color: '#999', marginBottom: '4px', display: 'block', textAlign: 'right' }}>{msg.time}</span>
                    <div style={{ background: 'linear-gradient(135deg, #00BCD4, #4DD0E1)', color: 'white', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', fontSize: '13px' }}>{msg.content}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {showInput && (
          <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid #e0e0e0' }}>
            <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendChat()} placeholder="파종 면적을 입력하세요..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '20px', fontSize: '13px', outline: 'none' }} />
            <button onClick={handleSendChat} style={{ background: '#00BCD4', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' }}>➤</button>
          </div>
        )}
      </div>
    );
  };

  // 작물 안내 화면 (정보형)
  const CropInfoView = () => {
    const recommendations = [
      { crop: '시금치', icon: '🥬', daysUntil: 5, date: '2월 20일', reason: '토양 온도와 습도 최적', profit: '수익률 180%', difficulty: '쉬움' },
      { crop: '봄배추', icon: '🥬', daysUntil: 12, date: '2월 27일', reason: '서리 위험 감소 시점', profit: '수익률 150%', difficulty: '보통' },
      { crop: '감자', icon: '🥔', daysUntil: 20, date: '3월 6일', reason: '지온 상승 예상 시점', profit: '수익률 120%', difficulty: '쉬움' }
    ];
    return (
      <div style={{ padding: '20px', overflow: 'auto', height: '100%' }}>
        <div style={{ background: 'linear-gradient(135deg, #E8F5E9, #DCEDC8)', borderRadius: '20px', padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌱</div>
          <h3 style={{ margin: '0 0 8px', color: '#2E7D32', fontSize: '18px' }}>맞춤 파종 추천</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#558B2F' }}>회원님의 농지 조건과 시장 상황을 분석했어요</p>
        </div>
        {recommendations.map((rec, idx) => (
          <div key={idx} style={{ background: 'white', borderRadius: '16px', padding: '18px', marginBottom: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: idx === 0 ? '2px solid #4CAF50' : '1px solid #e0e0e0', position: 'relative' }}>
            {idx === 0 && <div style={{ position: 'absolute', top: '-10px', right: '16px', background: 'linear-gradient(135deg, #4CAF50, #66BB6A)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>🏆 최적 추천</div>}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ width: '50px', height: '50px', background: '#F1F8E9', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>{rec.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#333' }}>{rec.crop}</h4>
                  <span style={{ background: '#E3F2FD', color: '#1976D2', padding: '2px 8px', borderRadius: '8px', fontSize: '10px' }}>난이도: {rec.difficulty}</span>
                </div>
                <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#666' }}>{rec.reason}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#FFF3E0', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', color: '#E65100' }}>📅 {rec.daysUntil}일 후 ({rec.date})</span>
                  <span style={{ fontSize: '11px', color: '#4CAF50', fontWeight: '600' }}>💰 {rec.profit}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div style={{ background: '#E1F5FE', borderRadius: '12px', padding: '14px 16px' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#0277BD', lineHeight: 1.5 }}>💡 <strong>TIP:</strong> 프로필에서 농지 정보를 더 상세히 입력하시면 더 정확한 추천을 받으실 수 있어요!</p>
        </div>
      </div>
    );
  };

  // 시세 안내 화면 (정보형)
  const MarketInfoView = () => {
    const priceData = [
      { name: '배추', price: 4200, change: +12.5, trend: [38, 39, 40, 41, 42], unit: '포기' },
      { name: '무', price: 1800, change: +8.2, trend: [16, 17, 17, 18, 18], unit: 'kg' },
      { name: '양파', price: 2100, change: -5.3, trend: [23, 22, 22, 21, 21], unit: 'kg' },
      { name: '고추', price: 12000, change: +15.8, trend: [102, 108, 112, 116, 120], unit: 'kg' }
    ];
    const MiniChart = ({ data, isUp }) => {
      const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
      const points = data.map((v, i) => `${i * 12},${24 - ((v - min) / range) * 20}`).join(' ');
      return <svg width="48" height="24"><polyline points={points} fill="none" stroke={isUp ? '#4CAF50' : '#F44336'} strokeWidth="2" strokeLinecap="round" /></svg>;
    };
    return (
      <div style={{ padding: '20px', overflow: 'auto', height: '100%' }}>
        <div style={{ background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', borderRadius: '20px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '32px' }}>📈</span>
            <div><h3 style={{ margin: 0, fontSize: '16px', color: '#2E7D32' }}>이번 주 HOT 품목</h3></div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div><span style={{ fontSize: '24px', marginRight: '10px' }}>🌶️</span><span style={{ fontSize: '18px', fontWeight: '700' }}>고추</span></div>
            <div style={{ textAlign: 'right' }}><p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#E91E63' }}>+15.8%</p><p style={{ margin: '2px 0 0', fontSize: '12px', color: '#666' }}>12,000원/kg</p></div>
          </div>
          <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#666', lineHeight: 1.5 }}>💡 <strong>분석:</strong> 기상 악화로 공급 감소, 김장철 대비 수요 증가로 가격 상승 중!</p>
        </div>
        <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', color: '#333' }}>주요 작물 시세</h3>
          {priceData.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: idx < priceData.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>{item.name}</p><p style={{ margin: '2px 0 0', fontSize: '11px', color: '#999' }}>/{item.unit}</p></div>
              <MiniChart data={item.trend} isUp={item.change > 0} />
              <div style={{ textAlign: 'right', marginLeft: '12px', minWidth: '70px' }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{item.price.toLocaleString()}원</p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', fontWeight: '600', color: item.change > 0 ? '#4CAF50' : '#F44336' }}>{item.change > 0 ? '▲' : '▼'} {Math.abs(item.change)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 병해충 안내 화면 (정보형)
  const PestInfoView = () => {
    const alerts = [
      { pest: '배추좀나방', risk: '높음', color: '#F44336', crops: ['배추', '무', '양배추'] },
      { pest: '진딧물', risk: '보통', color: '#FF9800', crops: ['고추', '토마토', '오이'] },
      { pest: '도열병', risk: '낮음', color: '#4CAF50', crops: ['벼'] }
    ];
    return (
      <div style={{ padding: '20px', overflow: 'auto', height: '100%' }}>
        <div style={{ background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', borderRadius: '20px', padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔬</div>
          <h3 style={{ margin: '0 0 8px', color: '#E65100', fontSize: '18px' }}>병해충 예보</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#BF360C' }}>회원님 지역 기준 병해충 발생 위험도</p>
        </div>
        {alerts.map((alert, idx) => (
          <div key={idx} style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', borderLeft: `4px solid ${alert.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '15px', color: '#333' }}>{alert.pest}</h4>
              <span style={{ background: `${alert.color}20`, color: alert.color, padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>위험도: {alert.risk}</span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>주의 작물: {alert.crops.join(', ')}</p>
          </div>
        ))}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <span style={{ fontSize: '36px' }}>📷</span>
          <h4 style={{ margin: '10px 0 8px', color: '#333' }}>AI 병해충 진단</h4>
          <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#666' }}>피해 증상 사진을 업로드하면 AI가 즉시 진단해드려요</p>
          <button style={{ background: 'linear-gradient(135deg, #FF9800, #FFB74D)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>사진 업로드하기</button>
        </div>
      </div>
    );
  };

  // 일정 안내 화면 (정보형)
  const CalendarInfoView = () => {
    const tasks = [
      { date: '2/15', task: '봄 감자 파종 준비', type: '파종', color: '#4CAF50' },
      { date: '2/18', task: '과수원 전정 작업', type: '관리', color: '#2196F3' },
      { date: '2/20', task: '시금치 파종 적기', type: '파종', color: '#4CAF50' },
      { date: '2/22', task: '병해충 예방 방제', type: '방제', color: '#FF9800' },
      { date: '2/28', task: '토양 검정 신청 마감', type: '행정', color: '#9C27B0' }
    ];
    return (
      <div style={{ padding: '20px', overflow: 'auto', height: '100%' }}>
        <div style={{ background: 'linear-gradient(135deg, #E8EAF6, #C5CAE9)', borderRadius: '20px', padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🗓️</div>
          <h3 style={{ margin: '0 0 8px', color: '#3F51B5', fontSize: '18px' }}>2월 영농 일정</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#5C6BC0' }}>이번 달 주요 농사 일정을 확인하세요</p>
        </div>
        <div style={{ background: 'white', borderRadius: '20px', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          {tasks.map((task, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: idx < tasks.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{ minWidth: '45px', textAlign: 'center' }}><p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#333' }}>{task.date}</p></div>
              <div style={{ width: '4px', height: '36px', background: task.color, borderRadius: '2px' }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '500', color: '#333' }}>{task.task}</p>
                <span style={{ background: `${task.color}15`, color: task.color, padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '500' }}>{task.type}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '16px', background: '#E8F5E9', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🔔</span>
          <p style={{ margin: 0, fontSize: '12px', color: '#2E7D32' }}><strong>알림 설정:</strong> 중요 일정 3일 전 푸시 알림을 받으세요</p>
        </div>
      </div>
    );
  };

  // 보조금 안내 화면 (정보형)
  const SubsidyInfoView = () => {
    const subsidies = [
      { name: '청년농업인 영농정착지원', amount: '월 100만원 (최대 3년)', deadline: '3월 15일', match: 95 },
      { name: '스마트팜 시설 지원사업', amount: '최대 5천만원 (자부담 30%)', deadline: '2월 28일', match: 88 },
      { name: '친환경농업 직접지불금', amount: 'ha당 최대 120만원', deadline: '4월 30일', match: 72 }
    ];
    return (
      <div style={{ padding: '20px', overflow: 'auto', height: '100%' }}>
        <div style={{ background: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)', borderRadius: '20px', padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>💰</div>
          <h3 style={{ margin: '0 0 8px', color: '#00838F', fontSize: '18px' }}>맞춤 보조금 안내</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#00ACC1' }}>회원님이 신청 가능한 보조금 목록입니다</p>
        </div>
        {subsidies.map((sub, idx) => (
          <div key={idx} style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '14px', color: '#333', flex: 1, lineHeight: 1.4 }}>{sub.name}</h4>
              <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap', marginLeft: '8px' }}>적합도 {sub.match}%</div>
            </div>
            <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#4CAF50', fontWeight: '600' }}>{sub.amount}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#F57C00' }}>⏰ 마감: {sub.deadline}</span>
              <button style={{ background: '#E3F2FD', color: '#1976D2', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: '500', cursor: 'pointer' }}>상세보기</button>
            </div>
          </div>
        ))}
        <div style={{ background: '#FCE4EC', borderRadius: '12px', padding: '14px 16px' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#C2185B', lineHeight: 1.5 }}>⚡ <strong>스마트팜 시설 지원사업</strong> 마감이 13일 남았습니다!</p>
        </div>
      </div>
    );
  };

  // 농가 프로파일링 화면 (알림톡 스타일)
  const ProfileView = () => {
    const [chatMessages, setChatMessages] = useState([
      { id: 1, type: 'bot', content: '안녕하세요, 농부님! 👨‍🌾\n\n더 정확한 맞춤 서비스를 제공해드리기 위해 몇 가지 정보가 필요해요.\n\n프로필을 등록하시면 이런 서비스를 받으실 수 있어요:\n\n✅ 맞춤 작물 추천\n✅ 지역별 병해충 예보\n✅ 정확한 파종/수확 일정\n✅ 맞춤 보조금 안내', buttons: ['좋아요, 등록할게요', '나중에 할게요'], time: '오전 09:00' }
    ]);
    const [inputVal, setInputVal] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [profileStep, setProfileStep] = useState(0);
    const [tempProfile, setTempProfile] = useState({ location: '', farmSize: '', crops: '', experience: '' });

    const profileQuestions = [
      { key: 'location', question: '먼저, 농지 위치를 알려주세요! 📍\n\n💬 예: "경기도 화성시", "충남 논산시"' },
      { key: 'farmSize', question: '농지 면적은 어느 정도인가요? 🌾\n\n💬 예: "3000평", "1헥타르", "5000㎡"' },
      { key: 'crops', question: '주로 재배하시는 작물은 무엇인가요? 🥬\n\n💬 예: "배추, 무", "고추랑 마늘", "벼농사 해요"' },
      { key: 'experience', question: '영농 경력은 어느 정도 되셨나요? 👨‍🌾\n\n💬 예: "5년 됐어요", "올해 처음 시작했어요", "10년 넘었어요"' }
    ];

    const handleButtonClick = (btn) => {
      setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', content: btn, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
      setTimeout(() => {
        if (btn.includes('등록')) {
          setShowInput(true);
          setProfileStep(1);
          setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: profileQuestions[0].question, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        } else if (btn.includes('나중에')) {
          setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: '알겠습니다! 😊\n\n언제든지 프로필 등록이 가능하니 필요하실 때 말씀해주세요.\n\n그래도 기본적인 서비스는 이용하실 수 있어요!', buttons: ['메인으로 돌아가기'], time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        } else if (btn === '메인으로 돌아가기') {
          setCurrentView('home');
        } else if (btn === '대시보드 보러가기') {
          setCurrentView('home');
        }
      }, 800);
    };

    const handleSendChat = () => {
      if (!inputVal.trim()) return;
      const text = inputVal;
      setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', content: text, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
      setInputVal('');
      
      const currentKey = profileQuestions[profileStep - 1]?.key;
      setTempProfile(prev => ({ ...prev, [currentKey]: text }));

      setTimeout(() => {
        if (profileStep < profileQuestions.length) {
          setProfileStep(profileStep + 1);
          setChatMessages(prev => [...prev, { id: Date.now(), type: 'bot', content: `"${text}" 확인했어요! ✅\n\n${profileQuestions[profileStep].question}`, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }]);
        } else {
          setShowInput(false);
          setChatMessages(prev => [...prev, { 
            id: Date.now(), 
            type: 'bot', 
            content: `프로필 등록이 완료되었습니다! 🎉\n\n📋 등록된 정보:\n• 위치: ${tempProfile.location}\n• 면적: ${tempProfile.farmSize}\n• 재배작물: ${tempProfile.crops}\n• 경력: ${text}\n\n이제 맞춤형 서비스를 받으실 수 있어요!\n첫 번째 추천: 현재 시기에 ${tempProfile.crops.split(',')[0] || '시금치'} 파종을 준비하시면 좋을 것 같아요! 🌱`, 
            buttons: ['대시보드 보러가기', '맞춤 추천 받기'], 
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) 
          }]);
        }
      }, 800);
    };

    return (
      <div style={{ padding: '16px', overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          {chatMessages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: '16px' }}>
              {msg.type === 'bot' ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', background: 'linear-gradient(180deg, #9C27B0, #7B1FA2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>✏️</div>
                  <div style={{ maxWidth: '80%' }}>
                    <span style={{ fontSize: '10px', color: '#999', marginBottom: '4px', display: 'block' }}>{msg.time}</span>
                    <div style={{ background: 'white', padding: '14px', borderRadius: '4px 16px 16px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: '#333', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{msg.content}</p>
                    </div>
                    {msg.buttons && (
                      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {msg.buttons.map((btn, idx) => (
                          <button key={idx} onClick={() => handleButtonClick(btn)} style={{ background: 'white', border: '1.5px solid #9C27B0', borderRadius: '20px', padding: '10px 16px', fontSize: '13px', color: '#9C27B0', fontWeight: '500', cursor: 'pointer', textAlign: 'left' }}>
                            {btn}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ maxWidth: '75%' }}>
                    <span style={{ fontSize: '10px', color: '#999', marginBottom: '4px', display: 'block', textAlign: 'right' }}>{msg.time}</span>
                    <div style={{ background: 'linear-gradient(135deg, #9C27B0, #BA68C8)', color: 'white', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', fontSize: '13px' }}>{msg.content}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {showInput && (
          <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid #e0e0e0' }}>
            <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendChat()} placeholder="답변을 입력하세요..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #e0e0e0', borderRadius: '20px', fontSize: '13px', outline: 'none' }} />
            <button onClick={handleSendChat} style={{ background: '#9C27B0', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' }}>➤</button>
          </div>
        )}
      </div>
    );
  };

  // 채팅 화면
  const formatChatContent = (content) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={idx} style={{ fontWeight: '600', color: '#2d5016', margin: '10px 0 4px', fontSize: '13px' }}>{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.includes('**')) {
        const parts = line.split(/\*\*/g);
        return <p key={idx} style={{ margin: '3px 0', color: '#555', fontSize: '13px', lineHeight: 1.5 }}>
          {parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
        </p>;
      }
      if (line.startsWith('•')) {
        return <p key={idx} style={{ margin: '3px 0', color: '#555', fontSize: '13px', paddingLeft: '4px' }}>{line}</p>;
      }
      if (line.match(/^\d\./)) {
        return <p key={idx} style={{ margin: '3px 0', color: '#555', fontSize: '13px', paddingLeft: '4px' }}>{line}</p>;
      }
      if (line.trim() === '') return <div key={idx} style={{ height: '6px' }} />;
      return <p key={idx} style={{ margin: '3px 0', color: '#444', fontSize: '13px', lineHeight: 1.5 }}>{line}</p>;
    });
  };

  const ChatView = () => (
    <div style={{ padding: '16px', minHeight: '100%' }}>
      {messages.map((msg) => (
        <div key={msg.id} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start', marginBottom: '16px' }}>
          {msg.type === 'bot' && <div style={{ width: '32px', height: '32px', background: 'linear-gradient(180deg, #8BC34A, #689F38)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginRight: '8px', flexShrink: 0 }}>🌱</div>}
          <div style={{ maxWidth: '75%' }}>
            <span style={{ fontSize: '10px', color: '#999', marginBottom: '4px', display: 'block', textAlign: msg.type === 'user' ? 'right' : 'left' }}>{msg.time}</span>
            {msg.type === 'user' ? (
              <div style={{ background: 'linear-gradient(135deg, #4CAF50, #66BB6A)', color: 'white', padding: '12px 16px', borderRadius: '18px 18px 4px 18px', fontSize: '14px' }}>{msg.content}</div>
            ) : (
              <div style={{ background: 'white', padding: '14px', borderRadius: '4px 18px 18px 18px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', fontSize: '14px' }}>
                {msg.title && <h4 style={{ color: '#2d5016', fontSize: '14px', fontWeight: '600', margin: '0 0 10px', paddingBottom: '8px', borderBottom: '1px solid #e8f5e9' }}>{msg.title}</h4>}
                <div>{formatChatContent(msg.content)}</div>
                {msg.links && <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e8f5e9' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '11px', color: '#888' }}>🔗 관련 바로가기</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {msg.links.map((link, idx) => (<button key={idx} onClick={() => handleSendMessage(link)} style={{ background: '#e8f5e9', border: 'none', borderRadius: '16px', padding: '6px 12px', fontSize: '11px', color: '#4CAF50', fontWeight: '500', cursor: 'pointer' }}>{link}</button>))}
                  </div>
                </div>}
              </div>
            )}
          </div>
        </div>
      ))}
      {isTyping && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(180deg, #8BC34A, #689F38)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🌱</div>
          <div style={{ background: 'white', padding: '12px 16px', borderRadius: '4px 18px 18px 18px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', gap: '5px' }}>{[0, 1, 2].map(i => (<div key={i} style={{ width: '7px', height: '7px', background: '#4CAF50', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out', animationDelay: `${i * 0.16}s` }} />))}</div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  // 자기소개 화면 (알림톡 스타일)
  const IntroView = () => {
    const [chatMessages, setChatMessages] = useState([
      { id: 1, type: 'bot', content: '안녕하세요! 👋\n저는 광주시의 대화형 AI 영농 비서입니다! 🌾\n\n농부님의 성공적인 영농을 위해 24시간 함께하고 있어요.\n\n저는 이런 일들을 도와드릴 수 있어요:', time: '오전 09:00' },
      { id: 2, type: 'bot', content: '🤖 **AI 알림톡 서비스**\n\n🌾 **작물 추천** - 파종/수확 시기가 되면 먼저 알려드려요\n🌤️ **기상 정보** - 농업 기상 특보를 실시간 안내해요\n🐛 **병해충** - 방제 시기를 놓치지 않게 체크해요\n📅 **영농 일정** - 중요한 농사 일정을 관리해요\n📊 **시세 정보** - 출하 최적 타이밍을 알려드려요\n🛒 **로컬푸드** - 수요 예측 기반 파종을 추천해요', time: '오전 09:00' },
      { id: 3, type: 'bot', content: '📋 **정보 안내 서비스**\n\n🌱 **작물 안내** - 맞춤형 파종 작물을 추천해요\n☀️ **날씨 안내** - 주간 날씨와 기온을 보여드려요\n🔬 **병해충 안내** - 지역별 병해충 예보를 확인해요\n🗓️ **일정 안내** - 월별 영농 일정을 한눈에 봐요\n📈 **시세 안내** - 주요 작물 시세를 확인해요\n💰 **보조금 안내** - 신청 가능한 보조금을 찾아드려요', time: '오전 09:00' },
      { id: 4, type: 'bot', content: '✨ **특별 기능**\n\n✏️ **농가 프로파일링** - 농지 정보를 등록하시면 더 정확한 맞춤 서비스를 받으실 수 있어요!\n\n💬 **자유 상담** - 언제든지 궁금한 것을 물어보세요. 농사 관련 모든 질문에 답변해드릴게요!\n\n무엇을 도와드릴까요? 😊', buttons: ['작물 추천 받기', '오늘 날씨 확인', '농가 프로필 등록', '메인으로 돌아가기'], time: '오전 09:00' }
    ]);

    const handleButtonClick = (btn) => {
      if (btn === '메인으로 돌아가기') {
        setCurrentView('home');
      } else if (btn === '작물 추천 받기') {
        setCurrentView('crop');
      } else if (btn === '오늘 날씨 확인') {
        setCurrentView('weather_info');
      } else if (btn === '농가 프로필 등록') {
        setCurrentView('profile');
      }
    };

    return (
      <div style={{ padding: '16px', overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          {chatMessages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(180deg, #4CAF50, #2E7D32)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🧑‍🌾</div>
                <div style={{ maxWidth: '85%' }}>
                  <span style={{ fontSize: '10px', color: '#999', marginBottom: '4px', display: 'block' }}>{msg.time}</span>
                  <div style={{ background: 'white', padding: '14px', borderRadius: '4px 16px 16px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#333', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      {msg.content.split('\n').map((line, idx) => {
                        if (line.startsWith('🤖') || line.startsWith('📋') || line.startsWith('✨')) {
                          return <span key={idx} style={{ display: 'block', fontWeight: '700', color: '#2E7D32', marginTop: idx > 0 ? '8px' : 0, marginBottom: '8px', fontSize: '14px' }}>{line}<br/></span>;
                        }
                        if (line.includes('**')) {
                          const parts = line.split('**');
                          return <span key={idx} style={{ display: 'block', marginBottom: '4px' }}>
                            {parts.map((part, i) => i % 2 === 1 ? <strong key={i} style={{ color: '#1B5E20' }}>{part}</strong> : part)}
                          </span>;
                        }
                        return <span key={idx}>{line}<br/></span>;
                      })}
                    </p>
                  </div>
                  {msg.buttons && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {msg.buttons.map((btn, idx) => (
                        <button key={idx} onClick={() => handleButtonClick(btn)} style={{ background: 'white', border: '1.5px solid #4CAF50', borderRadius: '20px', padding: '10px 16px', fontSize: '13px', color: '#4CAF50', fontWeight: '500', cursor: 'pointer', textAlign: 'left' }}>
                          {btn}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 홈 화면
  const HomeView = () => (
    <div style={{ padding: '20px' }}>
      <button onClick={() => setCurrentView('intro')} style={{ width: '100%', background: 'white', borderRadius: '20px', padding: '20px', marginBottom: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textAlign: 'center', position: 'relative', overflow: 'hidden', border: 'none', cursor: 'pointer' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(76,175,80,0.1), transparent)', borderRadius: '50%' }} />
        <div style={{ width: '80px', height: '80px', margin: '0 auto 12px', position: 'relative' }}>
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #8BC34A, #689F38)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', boxShadow: '0 8px 24px rgba(139,195,74,0.4)' }}>🧑‍🌾</div>
          <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#4CAF50', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', fontSize: '12px' }}>🌾</div>
        </div>
        <p style={{ color: '#4CAF50', fontSize: '13px', fontWeight: '500', margin: '0 0 4px' }}>풍요로운 수확, 스마트한 농업!</p>
        <h2 style={{ color: '#2d5016', fontSize: '20px', fontWeight: '700', margin: '0 0 6px' }}>무엇을 도와드릴까요?</h2>
        <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>👆 눌러서 AI 비서 소개 보기</p>
      </button>

      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#4CAF50', fontSize: '13px', fontWeight: '600', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}><span>💬</span> 자주 묻는 질문</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {frequentQuestions.map((q, idx) => (<button key={idx} onClick={() => handleSendMessage(q)} style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '12px 14px', textAlign: 'left', cursor: 'pointer', fontSize: '13px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#4CAF50' }}>•</span>{q}</button>))}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#4CAF50', fontSize: '13px', fontWeight: '600', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}><span>🤖</span> AI 알림톡</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {quickCategories.map((cat) => (<button key={cat.id} onClick={() => setCurrentView(cat.id)} style={{ background: 'white', border: 'none', borderRadius: '14px', padding: '14px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ width: '40px', height: '40px', background: `${cat.color}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{cat.icon}</div>
            <span style={{ fontSize: '11px', color: '#333', fontWeight: '500' }}>{cat.label}</span>
          </button>))}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#8E24AA', fontSize: '13px', fontWeight: '600', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}><span>📋</span> 정보 안내</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {infoCategories.map((cat) => (<button key={cat.id} onClick={() => setCurrentView(cat.id)} style={{ background: 'linear-gradient(135deg, #fafafa, #f5f5f5)', border: '1px solid #e8e8e8', borderRadius: '14px', padding: '14px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '40px', background: `${cat.color}20`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{cat.icon}</div>
            <span style={{ fontSize: '11px', color: '#555', fontWeight: '500' }}>{cat.label}</span>
          </button>))}
        </div>
      </div>

      <button onClick={() => setCurrentView('profile')} style={{ width: '100%', marginBottom: '12px', background: 'linear-gradient(135deg, #9C27B0, #BA68C8)', border: 'none', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(156,39,176,0.3)' }}>
        <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>✏️</div>
        <div style={{ textAlign: 'left' }}>
          <p style={{ margin: 0, color: 'white', fontSize: '14px', fontWeight: '600' }}>농가 프로파일링</p>
          <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.85)', fontSize: '11px' }}>맞춤 서비스를 위해 정보를 입력해주세요!</p>
        </div>
        <span style={{ marginLeft: 'auto', color: 'white', fontSize: '18px' }}>→</span>
      </button>

      <div style={{ background: 'linear-gradient(135deg, #fff8e1, #ffecb3)', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #ffe082' }}>
        <span style={{ fontSize: '22px' }}>🤖</span>
        <div><p style={{ fontSize: '11px', color: '#f57c00', fontWeight: '600', margin: '0 0 2px' }}>AI 상담 서비스 이용시간</p><p style={{ fontSize: '10px', color: '#666', margin: 0 }}>24시간 | 긴급상담: 1588-FARM</p></div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'intro': return <IntroView />;
      case 'weather': return <WeatherView />;
      case 'market': return <MarketView />;
      case 'crop': return <CropRecommendView />;
      case 'pest': return <PestView />;
      case 'calendar': return <CalendarView />;
      case 'localfood': return <LocalFoodView />;
      case 'profile': return <ProfileView />;
      case 'chat': return <ChatView />;
      case 'weather_info': return <WeatherInfoView />;
      case 'crop_info': return <CropInfoView />;
      case 'market_info': return <MarketInfoView />;
      case 'pest_info': return <PestInfoView />;
      case 'calendar_info': return <CalendarInfoView />;
      case 'subsidy_info': return <SubsidyInfoView />;
      default: return <HomeView />;
    }
  };

  const getHeaderTitle = () => {
    const titles = { intro: 'AI 비서 소개', weather: '기상 정보', market: '시세 정보', crop: '작물 추천', pest: '병해충 정보', calendar: '영농 일정', localfood: '로컬푸드 추천', profile: '농가 프로파일링', chat: 'AI 상담', weather_info: '날씨 안내', crop_info: '작물 안내', market_info: '시세 안내', pest_info: '병해충 안내', calendar_info: '일정 안내', subsidy_info: '보조금 안내' };
    return titles[currentView] || '스마트팜 AI 비서';
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', height: '100vh', maxHeight: '800px', margin: '0 auto', background: 'linear-gradient(180deg, #e8f5e9 0%, #f1f8e9 50%, #fffde7 100%)', borderRadius: '24px', overflow: 'hidden', fontFamily: "'Noto Sans KR', sans-serif", display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
      <div style={{ background: 'linear-gradient(135deg, #4CAF50, #66BB6A, #81C784)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(76,175,80,0.3)' }}>
        {currentView !== 'home' && (<button onClick={handleBack} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: '16px' }}>←</button>)}
        <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>🌱</div>
        <div><h1 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: 0 }}>{getHeaderTitle()}</h1><p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', margin: 0 }}>24시간 영농 상담 서비스</p></div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>{renderContent()}</div>

      <div style={{ background: 'white', padding: '14px 18px', borderTop: '1px solid #e0e0e0', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ width: '40px', height: '40px', background: '#f5f5f5', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px' }} title="사진 첨부">📷</button>
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="무엇이든 물어보세요..." style={{ flex: 1, padding: '11px 14px', border: '2px solid #e0e0e0', borderRadius: '22px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} onFocus={(e) => e.target.style.borderColor = '#4CAF50'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
          <button onClick={() => handleSendMessage()} disabled={!inputValue.trim()} style={{ width: '40px', height: '40px', background: inputValue.trim() ? 'linear-gradient(135deg, #4CAF50, #66BB6A)' : '#e0e0e0', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: inputValue.trim() ? 'pointer' : 'not-allowed', color: 'white', fontSize: '16px', boxShadow: inputValue.trim() ? '0 4px 12px rgba(76,175,80,0.3)' : 'none' }}>➤</button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '10px', color: '#999', margin: '8px 0 0' }}>{inputValue.length}/500 자</p>
      </div>

      <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }`}</style>
    </div>
  );
};

export default FarmingAIChatbot;