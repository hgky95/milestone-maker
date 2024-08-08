// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MileStoneMaker is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    uint256 private _learningPathIds;

    struct LearningPath {
        uint256 id;
        string ipfsHash;
        bool[] milestones;
        bool completed;
    }

    mapping(address => mapping(uint256 => LearningPath))
        public userLearningPaths;
    mapping(address => uint256[]) public userLearningPathIds;
    // mapping(address => mapping(uint256 => bool[]))
    //     public learningPathMilestones;

    address public aiAgent;

    event LearningPathCreated(
        address user,
        uint256 learningPathId,
        string ipfsHash
    );
    event MilestoneCompleted(
        address user,
        uint256 learningPathId
        // uint256 milestoneIndex
    );
    event AchievementMinted(
        address user,
        uint256 learningPathId,
        uint256 tokenId
    );

    constructor() ERC721("MileStoneMaker", "MM") Ownable(msg.sender) {}

    modifier onlyAIAgent() {
        require(msg.sender == aiAgent, "Caller is not the AI Agent");
        _;
    }

    function setAIAgent(address _newAIAgent) public onlyOwner {
        aiAgent = _newAIAgent;
    }

    function createLearningPath(
        address _user,
        string memory _ipfsHash,
        uint256 _milestoneCount
    ) public onlyAIAgent returns (uint256) {
        require(_milestoneCount > 0, "Milestone count must be greater than 0");

        _learningPathIds += 1;
        uint256 newLearningPathId = _learningPathIds;

        bool[] memory completedMilestones = new bool[](_milestoneCount);
        userLearningPaths[_user][newLearningPathId] = LearningPath(
            newLearningPathId,
            _ipfsHash,
            completedMilestones,
            false
        );
        userLearningPathIds[_user].push(newLearningPathId);

        emit LearningPathCreated(_user, newLearningPathId, _ipfsHash);

        return newLearningPathId;
    }

    function storeMilestones(
        address _user,
        uint256 _learningPathId,
        bool[] memory _milestones
    ) public onlyAIAgent {
        require(
            userLearningPaths[_user][_learningPathId].id != 0,
            "Learning path does not exist"
        );
        require(
            _milestones.length ==
                userLearningPaths[_user][_learningPathId].milestones.length,
            "Milestone count mismatch"
        );

        // learningPathMilestones[_user][_learningPathId] = _milestones;
        LearningPath storage path = userLearningPaths[_user][_learningPathId];
        path.milestones = _milestones;
    }

    function completeMilestone(
        address _user,
        uint256 _learningPathId
        // uint256 _milestoneIndex
    ) public onlyAIAgent {
        LearningPath storage path = userLearningPaths[_user][_learningPathId];
        require(path.id != 0, "Learning path does not exist");
        require(!path.completed, "Learning path already completed");
        // require(
        //     _milestoneIndex < path.milestones.length,
        //     "Invalid milestone index"
        // );

        // path.milestones[_milestoneIndex] = true;

        // emit MilestoneCompleted(_user, _learningPathId, _milestoneIndex);
        emit MilestoneCompleted(_user, _learningPathId);

        bool allCompleted = true;
        for (uint256 i = 0; i < path.milestones.length; i++) {
            if (!path.milestones[i]) {
                allCompleted = false;
                break;
            }
        }

        if (allCompleted) {
            path.completed = true;
            mintAchievement(_user, _learningPathId, path.ipfsHash);
        }
    }

    function mintAchievement(
        address _user,
        uint256 _learningPathId,
        string memory _tokenURI
    ) internal {
        _tokenIds += 1;
        uint256 newItemId = _tokenIds;
        _safeMint(_user, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        emit AchievementMinted(_user, _learningPathId, newItemId);
    }

    function isEligibleForNFT(
        address _user,
        uint256 _learningPathId
    ) public view returns (bool) {
        return userLearningPaths[_user][_learningPathId].completed;
    }

    function getLearningPath(
        address _user,
        uint256 _learningPathId
    ) public view returns (string memory, bool[] memory, bool) {
        LearningPath memory path = userLearningPaths[_user][_learningPathId];
        return (path.ipfsHash, path.milestones, path.completed);
    }

    function getUserLearningPathIds(
        address _user
    ) public view returns (uint256[] memory) {
        return userLearningPathIds[_user];
    }

    function getMilestones(
        address _user,
        uint256 _learningPathId
    ) public view returns (bool[] memory) {
        LearningPath storage path = userLearningPaths[_user][_learningPathId];
        return path.milestones;
        // return learningPathMilestones[_user][_learningPathId];
    }
}
