const staffs = [
    { name: "Richard Ochom", photo: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGV8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { name: "Cynthia Achieng'", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" }
]

export default function StaffPhotos() {
    return (
        <>
            <div className="row col-12 mx-auto my-3  px-5">
                {staffs.map((item, index) =>
                    <div key={index} className="col-sm-6 col-md-4 col-lg-3">
                        <div className="card h-100">
                            <div className="card-body p-0">
                                <img src={item.photo} alt={`#${index}`} style={{ minHeight: 100 + '%', height: 200 + 'px', width: 100 + '%' }} />
                            </div>
                            <div className="card-footer">
                                <div className="row d-flex justify-content-between">
                                    <div>250
                                        <span>{`#${index}`}</span><br />
                                        <small>{item.name}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="row col-10 mx-auto px-5 mt-5">
                <p>To upload photos, ensure that <b>photo name</b> matches staff serial number. e.g <b>#001.png</b> or <b>#001.jpg</b></p>
                <div className="card card-boy" style={{ height: 100 + 'px' }}>

                </div>
            </div>
        </>
    )
}