import { useEffect, useState } from "react";
import { useGetClubListMutation } from "../../store/api/clubApi";
import { Link } from "react-router-dom";
import Loader from "@/components/shared/Loader";

type clubLogo = {
    secureUrl: string;
};

type club = {
    _id: string;
    clubName: string;
    clubUsername: string;
    clubLogo: clubLogo;
};



const ClubCard: React.FC<{ club: club }> = ({ club }) => {
    return (
        <>
            <Link to={`/club/${club._id}`} className="" style={{
                backgroundColor:"rgb(135,126,255)",
                borderRadius:"20px"
            }}>
                <div className="clubsDisp">
                <div style={{

                }} className="card_section">
                    <img
                    style={{
                        borderRadius:"50%",
                        width:"50px",
                        height:"50px",
                        marginLeft:"0px",
                    }}
                        src={
                            club?.clubLogo?.secureUrl
                                ? club?.clubLogo?.secureUrl
                                :"/assets/images/dakshalogo.png"  
                         }
                        alt={`${club.clubName} Logo`}
                        className="card_image"
                    />
                </div>
                <div style={{
                }} className="card_section">
                    <h3 style={{
                        fontWeight:300,
                        fontSize:"1rem",
                        width:"100%",
                        
                        // padding:"8%",
                        textAlign:"left"
                    }} className="card_title h3-bold">{club.clubName}</h3>
                    <p className="card_body">{club.clubUsername}</p>
                </div>
                </div>
            </Link>
        </>
    );
};

const Saved = () => {
    const [getClubList,{isLoading}] = useGetClubListMutation();
    const [clubs, setClubs] = useState<club[]>([]);

    useEffect(() => {
        const fetchClubList = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token not found");
            }
            const session = await getClubList({ token });
            // Handle the result as needed
            if ("data" in session) {
                console.log(session);
                const updatedPosts = session.data.map((club: club) => ({
                    _id: club._id,
                    clubName: club.clubName,
                    clubLogo: club.clubLogo,
                }));
                setClubs(updatedPosts);
                console.log(clubs);
            }
        };

        fetchClubList();
    }, []);

    return (
        <>
        {isLoading?(
            <div className="home-container">
                    <Loader />
                </div>
        ):(
        <div className="flex flex-1">
            <div className="home-container">
                <div className="home-posts">
                    <h2 className="h3-bold md:h2-bold text-left w-full">
                        Clubs
                    </h2>

                    <ul className="flex flex-col flex-1 gap-9 w-full ">
                        {clubs?.map((club) => (
                            <ClubCard key={club._id} club={club} xs:m-5 />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
        )}
        </>
        );
};

export default Saved;
