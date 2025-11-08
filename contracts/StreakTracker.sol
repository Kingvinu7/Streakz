// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StreakTracker
 * @dev Track user streaks on Base chain
 */
contract StreakTracker {
    struct Streak {
        uint256 count;
        uint256 lastCheckIn;
        bool isActive;
    }
    
    mapping(address => Streak) public streaks;
    
    event StreakActivated(address indexed user, uint256 timestamp);
    event StreakContinued(address indexed user, uint256 newCount, uint256 timestamp);
    event StreakBroken(address indexed user, uint256 finalCount);
    
    uint256 public constant STREAK_WINDOW = 24 hours;
    uint256 public constant ACTIVATION_FEE = 0.0001 ether;
    
    /**
     * @dev Activate or continue a streak
     */
    function checkIn() external payable {
        require(msg.value >= ACTIVATION_FEE, "Insufficient payment");
        
        Streak storage userStreak = streaks[msg.sender];
        
        // First time activation
        if (!userStreak.isActive) {
            userStreak.isActive = true;
            userStreak.count = 1;
            userStreak.lastCheckIn = block.timestamp;
            emit StreakActivated(msg.sender, block.timestamp);
            return;
        }
        
        uint256 timeSinceLastCheckIn = block.timestamp - userStreak.lastCheckIn;
        
        // Check if within streak window
        if (timeSinceLastCheckIn <= STREAK_WINDOW) {
            require(timeSinceLastCheckIn >= 1 hours, "Already checked in recently");
            userStreak.count += 1;
            userStreak.lastCheckIn = block.timestamp;
            emit StreakContinued(msg.sender, userStreak.count, block.timestamp);
        } else {
            // Streak broken, restart
            uint256 oldCount = userStreak.count;
            userStreak.count = 1;
            userStreak.lastCheckIn = block.timestamp;
            emit StreakBroken(msg.sender, oldCount);
            emit StreakActivated(msg.sender, block.timestamp);
        }
    }
    
    /**
     * @dev Get user's current streak
     */
    function getStreak(address user) external view returns (
        uint256 count,
        uint256 lastCheckIn,
        bool isActive,
        bool isExpired
    ) {
        Streak memory userStreak = streaks[user];
        bool expired = userStreak.isActive && 
                      (block.timestamp - userStreak.lastCheckIn > STREAK_WINDOW);
        
        return (
            userStreak.count,
            userStreak.lastCheckIn,
            userStreak.isActive,
            expired
        );
    }
    
    /**
     * @dev Withdraw collected fees (only owner)
     */
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    function withdraw() external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }
}
