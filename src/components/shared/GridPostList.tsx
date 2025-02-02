// GridPostList.tsx
 import React from 'react';
import { Link } from 'react-router-dom';

type Post = {
  imageUrl: string;
  eventName: string;
  eventId:string;
};

type GridPostListProps = {
  posts: Post[];
  
};

const GridPostList: React.FC<GridPostListProps> = ({ posts}) => {
   
  return (
    <div className="p-2" style={{ textAlign: "center" }}>
      {posts.map((post) => (
        <div className="post-card flex flex-row md:flex-col " key={post.imageUrl}>
          <div className="">
            <Link to={`/posts/${post.eventId}`}>
              <img
                src={post.imageUrl}
                alt={post.eventName}
                className="w-[120px] h-[90px] md:w-full md:h-full rounded-2xl"
              />
            </Link>
          </div>
          <div className="pt-3 pl-4">
            <p
              style={{
                fontWeight: "bold",
                fontSize: "24px",
                marginBottom: "10px",
              }}
            >
              {post.eventName}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
            }
  

export default GridPostList;
