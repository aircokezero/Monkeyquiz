import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './leaderboard.css';

const Leaderboard = ({ currentUserId }) => {
  const [rankData, setRankData] = useState([]);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/leaderboard`);
        const scores = res.data;

        const leaderboardArray = scores.map((entry, index) => ({
          ...entry,
          rank: index + 1
        }));

        setRankData(leaderboardArray.slice(0, 10));

        const currentUserEntry = leaderboardArray.find(user => user.userId === currentUserId);
        if (currentUserEntry) {
          setUserRank(currentUserEntry);
        }

      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      }
    };

    fetchLeaderboard();
  }, [currentUserId]);

  return (
    <div className="leaderboard-section">
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Leaderboard</h3>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th className="lb_item">Rank</th>
            <th className="lb_item">Username</th>
            <th className="lb_item">Score</th>
            <th className="lb_item">Attempted</th>
          </tr>
        </thead>
        <tbody>
          {rankData.map((user, index) => (
            <tr key={user.userId}>
              <td className="lb_item">{user.rank}</td>
              <td className="lb_item">{user.username}</td>
              <td className="lb_item">{user.totalScore}</td>
              <td className="lb_item">{user.totalAttempts}</td>
            </tr>
          ))}
        </tbody>

        {userRank && (
          <tfoot>
            <tr className="your-rank-row">
              <td className="lb_item">{userRank.rank}</td>
              <td className="lb_item"><strong>{userRank.username} (You)</strong></td>
              <td className="lb_item"><strong>{userRank.totalScore}</strong></td>
              <td className="lb_item"><strong>{userRank.totalAttempts}</strong></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default Leaderboard;
