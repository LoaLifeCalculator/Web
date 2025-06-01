export const getClassImage = (className: string): string => {
  const classImageMap: { [key: string]: string } = {
    "버서커": "/images/classes/berserker.png",
    "디스트로이어": "/images/classes/destroyer.png",
    "워로드": "/images/classes/gunlancer.png",
    "홀리나이트": "/images/classes/paladin.png",
    "슬레이어": "/images/classes/slayer.png",
    "배틀마스터": "/images/classes/wardancer.png",
    "인파이터": "/images/classes/scrapper.png",
    "기공사": "/images/classes/soulfist.png",
    "창술사": "/images/classes/glaivier.png",
    "스트라이커": "/images/classes/striker.png",
    "브레이커": "/images/classes/breaker.png",
    "건슬링어": "/images/classes/gunslinger.png",
    "데빌헌터": "/images/classes/deadeye.png",
    "블래스터": "/images/classes/artillerist.png",
    "호크아이": "/images/classes/sharpshooter.png",
    "스카우터": "/images/classes/machinist.png",
    "바드": "/images/classes/bard.png",
    "서머너": "/images/classes/summoner.png",
    "아르카나": "/images/classes/arcanist.png",
    "소서리스": "/images/classes/sorceress.png",
    "블레이드": "/images/classes/deathblade.png",
    "데모닉": "/images/classes/shadowhunter.png",
    "리퍼": "/images/classes/reaper.png",
    "소울이터": "/images/classes/souleater.png",
    "도화가": "/images/classes/artist.png",
    "기상술사": "/images/classes/aeromancer.png",
    "환수사": "/images/classes/wildsoul.png"
  };

  return classImageMap[className] || "/images/classes/default.png";
}; 