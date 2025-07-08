import { FaTrophy, FaMedal, FaAward, FaStar } from "react-icons/fa"

const Achievements = () => {
  const achievements = [
    {
      icon: <FaTrophy />,
      title: "Best Sports Platform 2023",
      description: "Awarded by Indian Sports Association",
      color: "#f59e0b",
    },
    {
      icon: <FaMedal />,
      title: "Customer Choice Award",
      description: "Voted by 10,000+ satisfied customers",
      color: "#10b981",
    },
    {
      icon: <FaAward />,
      title: "Innovation in Sports Tech",
      description: "Recognized for technological excellence",
      color: "#3b82f6",
    },
    {
      icon: <FaStar />,
      title: "5-Star Rating",
      description: "Consistently rated 5 stars by users",
      color: "#ef4444",
    },
  ]

  return (
    <section className="section-padding">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ color: "#10b981" }}>
              Our Achievements
            </h2>
            <p className="text-white-50" style={{ maxWidth: "650px", margin: "0 auto" }}>
              Recognition for our commitment to excellence in sports venue booking
            </p>
          </div>
        </div>
        <div className="row">
          {achievements.map((achievement, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-4">
              <div className="glass-card p-4 text-center h-100">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: "75px",
                    height: "75px",
                    background: achievement.color,
                    color: "#fff",
                    fontSize: "1.6rem",
                    boxShadow: `0 8px 25px ${achievement.color}40`,
                  }}
                >
                  {achievement.icon}
                </div>
                <h5 className="text-white mb-2 fw-semibold">{achievement.title}</h5>
                <p className="text-white-50 mb-0" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Achievements
