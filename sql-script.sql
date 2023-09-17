-- Table: public.Family

-- DROP TABLE IF EXISTS public."Family";

CREATE TABLE IF NOT EXISTS public."Family"
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    surname text COLLATE pg_catalog."default",
    village text COLLATE pg_catalog."default",
    "currResidency" text COLLATE pg_catalog."default",
    "adobeOfGod" text COLLATE pg_catalog."default",
    goddess text COLLATE pg_catalog."default",
    lineage text COLLATE pg_catalog."default",
    "residencyAddress" text COLLATE pg_catalog."default",
    "villageGuj" text COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone,
    "createdById" bigint,
    "updatedAt" timestamp with time zone,
    "updatedById" bigint,
    disabled boolean,
    "enabledDisabledOn" timestamp with time zone,
    "rowVersion" bytea,
    CONSTRAINT "Family_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Family"
    OWNER to postgres;



-- Table: public.Role

-- DROP TABLE IF EXISTS public."Role";

CREATE TABLE IF NOT EXISTS public."Role"
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name text COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    "roleType" text COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "createdById" bigint,
    "updatedById" bigint,
    disabled boolean,
    "enabledDisabledOn" date,
    "rowVersion" bytea,
    CONSTRAINT "Role_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Role"
    OWNER to postgres;


-- Table: public.RolePermission

-- DROP TABLE IF EXISTS public."RolePermission";

CREATE TABLE IF NOT EXISTS public."RolePermission"
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    "permissionFor" text COLLATE pg_catalog."default",
    permissions text COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now(),
    "createdById" bigint,
    "updatedById" bigint,
    disabled boolean DEFAULT false,
    "enabledDisabledOn" timestamp with time zone DEFAULT now(),
    "rowVersion" bytea,
    CONSTRAINT "RolePermission_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."RolePermission"
    OWNER to postgres;


-- Table: public.RoleRolePermission

-- DROP TABLE IF EXISTS public."RoleRolePermission";

CREATE TABLE IF NOT EXISTS public."RoleRolePermission"
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    "roleId" bigint NOT NULL,
    "rolePermissionId" bigint NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now(),
    "createdById" bigint,
    "updatedById" bigint,
    disabled boolean DEFAULT false,
    "enabledDisabledOn" timestamp with time zone DEFAULT now(),
    "rowVersion" bytea,
    CONSTRAINT "RoleRolePermission_pkey" PRIMARY KEY ("roleId", "rolePermissionId"),
    CONSTRAINT "RoleRolePermission_roleId_fkey" FOREIGN KEY ("roleId")
        REFERENCES public."Role" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT "RoleRolePermission_rolePermissionId_fkey" FOREIGN KEY ("rolePermissionId")
        REFERENCES public."RolePermission" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."RoleRolePermission"
    OWNER to postgres;


-- Table: public.User

-- DROP TABLE IF EXISTS public."User";

CREATE TABLE IF NOT EXISTS public."User"
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    username text COLLATE pg_catalog."default",
    "userType" text COLLATE pg_catalog."default",
    "isImageAvailable" boolean DEFAULT false,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now(),
    "createdById" bigint,
    "updatedById" bigint,
    disabled boolean DEFAULT false,
    "enabledDisabledOn" timestamp with time zone DEFAULT now(),
    "rowVersion" bytea,
    "roleId" bigint,
    CONSTRAINT "User_pkey" PRIMARY KEY (id),
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId")
        REFERENCES public."Role" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."User"
    OWNER to postgres;



-- Table: public.UserProfile

-- DROP TABLE IF EXISTS public."UserProfile";

CREATE TABLE IF NOT EXISTS public."UserProfile"
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    "userId" bigint NOT NULL,
    name text COLLATE pg_catalog."default",
    "wifeSurname" text COLLATE pg_catalog."default",
    "marriedStatus" text COLLATE pg_catalog."default",
    "birthDate" date,
    "weddingDate" date,
    education text COLLATE pg_catalog."default",
    occupation text COLLATE pg_catalog."default",
    "mobileNumber" text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now(),
    "createdById" bigint,
    "updatedById" bigint,
    disabled boolean DEFAULT false,
    "enabledDisabledOn" timestamp with time zone DEFAULT now(),
    "rowVersion" bytea,
    "countryCode" text COLLATE pg_catalog."default",
    "familyId" bigint,
    gender text COLLATE pg_catalog."default",
    "isMainFamilyMember" boolean,
    "mainFamilyMemberId" bigint,
    "mainFamilyMemberRelation" text COLLATE pg_catalog."default",
    "motherId" bigint,
    "motherName" text COLLATE pg_catalog."default",
    "fatherId" bigint,
    "fatherName" text COLLATE pg_catalog."default",
    CONSTRAINT "UserProfile_pkey" PRIMARY KEY (id),
    CONSTRAINT "UserProfile_familyId_fkey" FOREIGN KEY ("familyId")
        REFERENCES public."Family" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public."User" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."UserProfile"
    OWNER to postgres;




-- Table: public.UserProfileImage

-- DROP TABLE IF EXISTS public."UserProfileImage";

CREATE TABLE IF NOT EXISTS public."UserProfileImage"
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    image text COLLATE pg_catalog."default",
    "userId" bigint,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now(),
    "createdById" bigint,
    "updatedById" bigint,
    disabled boolean DEFAULT false,
    "enabledDisabledOn" timestamp with time zone DEFAULT now(),
    "rowVersion" bytea,
    "originalImage" text COLLATE pg_catalog."default",
    CONSTRAINT "UserProfileImage_pkey" PRIMARY KEY (id),
    CONSTRAINT "UserProfileImage_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public."User" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."UserProfileImage"
    OWNER to postgres;



-- Table: public.UserRefreshToken

-- DROP TABLE IF EXISTS public."UserRefreshToken";

CREATE TABLE IF NOT EXISTS public."UserRefreshToken"
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    "userId" bigint,
    "refreshToken" text COLLATE pg_catalog."default",
    "validTill" date,
    "createdAt" timestamp with time zone DEFAULT now(),
    "createdById" bigint,
    CONSTRAINT "UserRefreshToken_pkey" PRIMARY KEY (id),
    CONSTRAINT "UserRefreshToken_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public."User" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."UserRefreshToken"
    OWNER to postgres;