import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize authorization state and mixin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  type MemberStatus = { #active; #inactive };

  public type Member = {
    id : Nat;
    name : Text;
    contact : Text;
    status : MemberStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    planId : ?Nat;
    membershipStart : ?Time.Time;
    membershipEnd : ?Time.Time;
  };

  public type Payment = {
    id : Nat;
    memberId : Nat;
    amount : Float;
    date : Time.Time;
    method : Text;
    notes : Text;
  };

  public type CheckIn = {
    id : Nat;
    memberId : Nat;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    memberId : ?Nat;
  };

  // Persistent state
  let members = Map.empty<Nat, Member>();
  let payments = Map.empty<Nat, Payment>();
  let checkIns = List.empty<CheckIn>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let principalToMemberId = Map.empty<Principal, Nat>();
  var nextMemberId = 1;
  var nextPaymentId = 1;
  var nextCheckInId = 1;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper function to check if caller owns a member record
  func callerOwnsMember(caller : Principal, memberId : Nat) : Bool {
    switch (principalToMemberId.get(caller)) {
      case (null) { false };
      case (?id) { id == memberId };
    };
  };

  // CRUD Operations
  public shared ({ caller }) func createMember(name : Text, contact : Text) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create members");
    };
    let member : Member = {
      id = nextMemberId;
      name;
      contact;
      status = #active;
      createdAt = Time.now();
      updatedAt = Time.now();
      planId = null;
      membershipStart = null;
      membershipEnd = null;
    };
    members.add(nextMemberId, member);
    nextMemberId += 1;
    member.id;
  };

  public shared ({ caller }) func updateMember(id : Nat, name : Text, contact : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update members");
    };
    switch (members.get(id)) {
      case (null) { Runtime.trap("Member not found") };
      case (?member) {
        let updatedMember = {
          member with
          name;
          contact;
          updatedAt = Time.now();
        };
        members.add(id, updatedMember);
      };
    };
  };

  public shared ({ caller }) func linkPrincipalToMember(user : Principal, memberId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can link principals to members");
    };
    switch (members.get(memberId)) {
      case (null) { Runtime.trap("Member not found") };
      case (?_) {
        principalToMemberId.add(user, memberId);
      };
    };
  };

  public shared ({ caller }) func addPayment(memberId : Nat, amount : Float, method : Text, notes : Text) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add payments");
    };
    let payment : Payment = {
      id = nextPaymentId;
      memberId;
      amount;
      date = Time.now();
      method;
      notes;
    };
    payments.add(nextPaymentId, payment);
    nextPaymentId += 1;
    payment.id;
  };

  public shared ({ caller }) func checkIn(memberId : Nat) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can record check-ins");
    };
    let checkIn : CheckIn = {
      id = nextCheckInId;
      memberId;
      timestamp = Time.now();
    };
    checkIns.add(checkIn);
    nextCheckInId += 1;
    checkIn.id;
  };

  public query ({ caller }) func getMember(id : Nat) : async Member {
    // Allow admins to view any member, or users to view their own member record
    if (not (AccessControl.isAdmin(accessControlState, caller)) and not callerOwnsMember(caller, id)) {
      Runtime.trap("Unauthorized: Can only view your own member record");
    };
    switch (members.get(id)) {
      case (null) { Runtime.trap("Member not found") };
      case (?member) { member };
    };
  };

  public query ({ caller }) func getAllMembers() : async [Member] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all members");
    };
    members.values().toArray();
  };

  public query ({ caller }) func getPaymentsForMember(memberId : Nat) : async [Payment] {
    // Allow admins to view any member's payments, or users to view their own payments
    if (not (AccessControl.isAdmin(accessControlState, caller)) and not callerOwnsMember(caller, memberId)) {
      Runtime.trap("Unauthorized: Can only view your own payments");
    };
    payments.values().toArray().filter(func(payment) { payment.memberId == memberId });
  };

  public query ({ caller }) func getCheckInsForMember(memberId : Nat) : async [CheckIn] {
    // Allow admins to view any member's check-ins, or users to view their own check-ins
    if (not (AccessControl.isAdmin(accessControlState, caller)) and not callerOwnsMember(caller, memberId)) {
      Runtime.trap("Unauthorized: Can only view your own check-ins");
    };
    checkIns.toArray().filter(func(checkIn) { checkIn.memberId == memberId });
  };
};
