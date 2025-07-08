import { FaUsers, FaMapMarkerAlt, FaCalendarCheck, FaSmile } from "react-icons/fa"

const Counters = () => {
  const counters = [
    {
      icon: <FaUsers />,
      number: "10,000+",
      label: "Happy Customers",
      color: "#10b981",
    },
    {
      icon: <FaMapMarkerAlt />,
      number: "500+",
      label: "Sports Venues",
      color: "#f59e0b",
    },
    {
      icon: <FaCalendarCheck />,
      number: "50,000+",
      label: "Bookings Completed",
      color: "#3b82f6",
    },
    {
      icon: <FaSmile />,
      number: "98%",
      label: "Customer Satisfaction",
      color: "#ef4444",
    },
  ]

  return (
    <section className="section-padding" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ color: "#10b981" }}>
              Our Impact in Numbers
            </h2>
            <p className="text-white-50" style={{ maxWidth: "650px", margin: "0 auto" }}>
              See how we're making a difference in the sports community across India
            </p>
          </div>
        </div>
        <div className="row">
          {counters.map((counter, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-4">
              <div className="glass-card p-4 text-center h-100">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: "75px",
                    height: "75px",
                    background: counter.color,
                    color: "#fff",
                    fontSize: "1.6rem",
                    boxShadow: `0 8px 25px ${counter.color}40`,
                  }}
                >
                  {counter.icon}
                </div>
                <h2 className="text-white fw-bold mb-2" style={{ fontSize: "2.5rem" }}>
                  {counter.number}
                </h2>
                <p className="text-white-50 mb-0" style={{ fontSize: "14px" }}>
                  {counter.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Counters
