import { Events } from "./event";
import { EventImages } from "./eventImage";
import { Family } from "./family";
import { Donor, Funds } from "./fund-donor";
import { Role, RolePermission, RoleRolePermission } from "./role"
import { SocialWorker } from "./socialWorket";
import { Sponsor, Sponsorship } from "./sponsor";
import { User } from "./user";
import { UserProfile, UserProfileImage } from "./userProfile";

export const dbContext = () => {

    //One to Many relation between Role and RolePermission 
    Role.hasMany(RoleRolePermission, {
        foreignKey: 'id',
        as: 'roleRolePermission'
    });
    RoleRolePermission.belongsTo(Role, {
        foreignKey: 'roleId',
    });

    RolePermission.hasMany(RoleRolePermission, {
        foreignKey: 'id',
        as: 'roleRolePermission'
    });
    RoleRolePermission.belongsTo(RolePermission, {
        foreignKey: 'rolePermissionId'
    });

    //One to One relationship between Role and User 
    Role.hasMany(User, {
        foreignKey: 'id',
        as: 'UserRoleId'
    })
    User.belongsTo(Role, {
        foreignKey: 'roleId'
    })

    //One to One relationship between User and UserProfile 
    User.hasOne(UserProfile, {
        foreignKey: 'id',
        as: 'UserProfileId'
    })
    UserProfile.belongsTo(User, {
        foreignKey: 'userId'
    })

    //One to One relationship between User and UserProfileImage 
    User.hasOne(UserProfileImage, {
        foreignKey: 'id',
        as: 'UserProfileImageId'
    })
    UserProfileImage.belongsTo(User, {
        foreignKey: 'userId'
    })

    //One to Many relationship between Family and UserProfile
    Family.hasMany(UserProfile, {
        foreignKey: 'id',
        as: 'FamilyUserProfileId'
    })
    UserProfile.belongsTo(Family, {
        foreignKey: 'familyId'
    })

    //One to Many relationship between Family and UserProfile
    Events.hasMany(EventImages, {
        foreignKey: 'id',
        as: 'EventEventImageId'
    })
    EventImages.belongsTo(Events, {
        foreignKey: 'eventId'
    })


    //One to One relationship between SocialWorker and User
    User.hasOne(SocialWorker, {
        foreignKey: 'id',
        as: 'UserIdtoSocialWorker'
    })
    SocialWorker.belongsTo(User, {
        foreignKey: 'userId'
    })

    //One to Many relationship between Sponsor and Sponsorship
    Sponsor.hasMany(Sponsorship, {
        foreignKey: 'id',
        as: 'SponsorShip'
    });
    Sponsorship.belongsTo(Sponsor, {
        foreignKey: 'sponsorId'
    })

    //One to one relationship between Donor and User
    User.hasOne(Donor, {
        foreignKey: 'id',
        as: 'UserIdtoDonor'
    })
    Donor.belongsTo(User, {
        foreignKey: 'userId'
    })

    //One to Many relationship beetween Donor and Funds
    Donor.hasMany(Funds, {
        foreignKey: 'id',
        as: 'donorFunds'
    });
    Funds.belongsTo(Donor, {
        foreignKey: 'donorId'
    }) 
}