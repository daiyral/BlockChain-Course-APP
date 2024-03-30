import React, { useEffect, useState } from 'react';

const ResultsPage = (candidates) => {
    const [winner, setWinner] = useState(null);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        // Fetch the candidates data from your data source here
        // This is just a mock data
        

        const totalVotes = candidates.reduce((total, candidate) => total + candidate.votes, 0);
        const winner = candidates.reduce((prev, current) => (prev.votes > current.votes) ? prev : current);
        const percentage = ((winner.votes / totalVotes) * 100).toFixed(2);

        setWinner(winner);
        setPercentage(percentage);
    }, []);

    return (
        <div>
            <h1>Results Page</h1>
            {winner && (
                <>
                    <p>Winner: {winner.name}</p>
                    <p>Percentage of votes: {percentage}%</p>
                </>
            )}
        </div>
    );
}

export default ResultsPage;