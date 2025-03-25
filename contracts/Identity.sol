// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Identity is Ownable {
    struct IdentityData {
        string name;
        string email;
        bool isValid;
    }

    mapping(address => IdentityData) public identities;

    event IdentityCreated(address indexed owner, string name, string email);
    event IdentityUpdated(address indexed owner);
    event IdentityRevoked(address indexed owner);

    constructor(address initialOwner) Ownable(initialOwner) {

    }

    function createIdentity(string memory _name, string memory _email) public {
        require(identities[msg.sender].isValid == false, "Identity already exists");
        identities[msg.sender] = IdentityData(_name, _email, true);
        emit IdentityCreated(msg.sender, _name, _email);
    }

    function updateIdentity(string memory _name, string memory _email) public onlyOwner {
        require(identities[msg.sender].isValid == true, "Identity does not exist");
        identities[msg.sender].name = _name;
        identities[msg.sender].email = _email;
        emit IdentityUpdated(msg.sender);
    }

    function revokeIdentity() public onlyOwner {
        require(identities[msg.sender].isValid == true, "Identity does not exist");
        identities[msg.sender].isValid = false;
        emit IdentityRevoked(msg.sender);

    }

    function isValid(address _owner) public view returns (bool) {
        return identities[_owner].isValid;
    }
}
