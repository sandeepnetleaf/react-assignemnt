// PostList.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Define styled-components
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const PostCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  width: 22%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 48%;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const PostTitle = styled.h3`
  margin: 0 0 8px;
`;

const PostBody = styled.p`
  margin: 0;
`;

const UserName = styled.p`
  font-weight: bold;
  margin-top: 8px;
`;

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<{ [key: number]: User }>({});

  useEffect(() => {
    // Fetch posts
    axios.get('https://dummyjson.com/posts')
      .then(response => {
        const firstTenPosts = response.data.posts.slice(0, 10);
        setPosts(firstTenPosts);

        // Fetch user data for each post
        const userIds = firstTenPosts.map(<any>post => post.userId);
        userIds.forEach(userId => {
          if (!users[userId]) {
            axios.get(`https://dummyjson.com/users/${userId}`)
              .then(userResponse => {
                setUsers(prevUsers => ({
                  ...prevUsers,
                  [userId]: userResponse?.data,
                }));
              });
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  return (
    <Container>
      {posts?.map(post => (
        <PostCard key={post.id}>
          <PostTitle>{post.title}</PostTitle>
          <PostBody>{post.body}</PostBody>
          {users[post.userId] && (
            <UserName>{users[post.userId].firstName} {users[post.userId].lastName}</UserName>
          )}
        </PostCard>
      ))}
    </Container>
  );
};

export default PostList;
