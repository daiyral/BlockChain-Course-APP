pragma solidity >=0.4.21 <0.9.0;

contract Election {
    address public admin;
    uint256 candidateCount;
    uint256 voterCount;
    bool isOngoing;

    constructor() public {
        admin = msg.sender;
        candidateCount = 0;
        voterCount = 0;
        isOngoing = false;
    }

    function getAdmin() public view returns (address) {
        return admin;
    }

    modifier onlyAdmin() {
        // Modifier for only admin access
        require(msg.sender == admin);
        _;
    }
    // Modeling a candidate
    struct Candidate {
        uint256 Id;
        string header;
        string slogan;
        uint256 voteCount;
    }
    mapping(uint256 => Candidate) public candidateDetails;

    function addCandidate(string memory _header, string memory _slogan)
        public
        // Only admin can add
        onlyAdmin
    {
        Candidate memory newCandidate =
            Candidate({
                Id: candidateCount,
                header: _header,
                slogan: _slogan,
                voteCount: 0
            });
        candidateDetails[candidateCount] = newCandidate;
        candidateCount += 1;
    }

    struct ElectionDetails {
        string adminName;
        string electionName;
    }
    ElectionDetails electionDetails;

    function setElectionDetails(
        string memory _adminName,
        string memory _electionName
    )
        public
        // Only admin can add
        onlyAdmin
    {
        //delete all previous data
        for (uint i = 0; i < candidateCount; i++) {
            delete candidateDetails[i];
        }
        candidateCount = 0;
        voterCount = 0;
        electionDetails = ElectionDetails(
            _adminName,
            _electionName
        );
        isOngoing = true;
    }

    function getElectionDetails()
    public
    view
    returns(string memory adminName, 
    string memory electionName){
        return(electionDetails.adminName, 
        electionDetails.electionName);
    }

    function getTotalCandidate() public view returns (uint256) {
        return candidateCount;
    }

    function getTotalVoter() public view returns (uint256) {
        return voterCount;
    }

    // Modeling a voter
    struct Voter {
        address voterAddress;
        string name;
        string phone;
        bool isVerified;
        bool hasVoted;
        bool isRegistered;
    }
    address[] public voters;
    mapping(address => Voter) public voterDetails;

    // Request to be added as voter
    function registerAsVoter(string memory _name, string memory _phone) public {
        Voter memory newVoter =
            Voter({
                voterAddress: msg.sender,
                name: _name,
                phone: _phone,
                hasVoted: false,
                isVerified: false,
                isRegistered: true
            });
        voterDetails[msg.sender] = newVoter;
        voters.push(msg.sender);
        voterCount += 1;
    }

    // To vote user must be verified
    function verifyVoter(bool _verifedStatus, address voterAddress)
        public
        // Only admin can verify
        onlyAdmin
    {
        voterDetails[voterAddress].isVerified = _verifedStatus;
    }

    function vote(uint256 Id) public {
        require(voterDetails[msg.sender].hasVoted == false);
        require(voterDetails[msg.sender].isVerified == true);
        require(isOngoing == true);
        candidateDetails[Id].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
    }

    function endElection() public onlyAdmin {
        isOngoing = false;
    }
    function getElectionStatus() public view returns (bool) {
        return isOngoing;
    }

    function deleteElection() public onlyAdmin {
        if (!isOngoing) {
        revert("No ongoing election to delete.");
    }
    for (uint i = 0; i < candidateCount; i++) {
            delete candidateDetails[i];
        }
        candidateCount = 0;
        voterCount = 0;
        isOngoing = false;
        delete electionDetails;
    }

}