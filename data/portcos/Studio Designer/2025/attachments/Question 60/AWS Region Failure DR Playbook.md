# AWS Regional Failure Disaster Recovery Playbook - WIP

>This playbook will contain instructions for performing an AWS regional fail-over in the event StudioDesigner's primary AWS region becomes inoperable or unavailable for extended period of time.

## Determining a 'Disaster Event'
### Criteria of disaster and Threshold for invoking the playbook

>TBD - (This seems like it should be decided by the team in conjunction with overall incident management process)

## Executing the Playbook
### User Requirements and Permissions

**Required Permissions:**
- AWS console access via AWS SSO
    - Requires permissions for all AWS services necessary for deploying and running StudioDesigner
        - ECS (Elastic Container Service)
        - ECR (Elastic Container Registry)
        - RDS (Relational Database Service)
        - ElastiCache (Managed Redis caching)
        - S3 (Simple Storage Service)
        - EC2/ELB (Elastic Compute and Elastic Load Balancing)
        - VPC (Virtual Private Cloud)
        - Route53 (DNS Services)
        - KMS (Key Management Service)
        - ACM (Certificate Management Service)
        - SSM Parameter Store (Systems Manager)
        - CloudFront
        - Global Accelerator
        - CloudFormation
        - CodePipeline
        - IAM

**Optional Permissions:**
- Azure DevOps Repos access to aws-infrastructure repository (optional)
    - The playbook can be executed in it's entirety without needing to commit changes to source control, but then requires additional manual steps. Both processes will be outlined in this document.

### Performing an 'Automated' Fail-over

---
1. Declare a "Disaster Event" is occurring that meets or exceeds the threshold for invoking a regional fail-over.
---
2. Change CloudFormation stack input parameters:
    1. Make the following changes to files and commit to source control: (Perform the updates in this order)
        1. > *aws-infrastructure\StudioDesignerApp\AppServices\DependencyStackInput\ENVIRONMENT\VPC-input.json*
            - **DisasterEvent**: 'No' -> 'Yes'
        2. > *aws-infrastructure\StudioDesignerApp\AppServices\ControlStackInput\ENVIRONMENT-us-east-1-maincontrolstack-input.json*
            - **DisasterEvent**: 'No' -> 'Yes'
            - **EnableContainers**: 'Yes' -> 'No'
        3. > *aws-infrastructure\StudioDesignerApp\AppServices\ControlStackInput\ENVIRONMENT-us-east-2-maincontrolstack-input.json*
            - **DisasterEvent**: 'No' -> 'Yes'
            - **EnableContainers**: 'No' -> 'Yes'
        4. Once each of the three above files have been changed, AzDO pipelines will have created a new artifact for upload to AWS, but the actual push will need to be started and approved in the AzDO Releases console. 
        AzDO Releases: https://dev.azure.com/StudioDesigner/DevSecOps/_release?_a=releases&view=mine&definitionId=1
            1. Go to the latest release number
            2. Select the environment to deploy to > Deploy. 
            3. Once the deploy process has started, an Approve button will appear. Select Approve. 
            4. Wait for the S3 Push to complete. 
    2. If source control access is unavailable or CodePipeline is included in the outage, the stacks can be updated manually on the CloudFormation console. This process will need to be performed in each region respectively for all stacks requiring changed inputs. Please see **Appendix B "CodePipeline and S3 Artifact Storage"** for additional information regarding necessary prerequisite steps when updating CloudFormation stacks directly. 
        1. Select stack (i.e. QA-MainControlStack, QA-VPC, etc.)
        2. Update > "Use existing template" 
        3. Change appropriate inputs. 

    >**NOTE:** CICD status can be followed in the CodePipeline and CloudFormation consoles.

    >**CodePipeline:** 
    us-east-1: https://us-east-1.console.aws.amazon.com/codesuite/codepipeline/pipelines?region=us-east-1
    us-east-2: https://us-east-2.console.aws.amazon.com/codesuite/codepipeline/pipelines?region=us-east-2

    >**CloudFormation:**
    us-east-1: https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks
    us-east-2: https://us-east-2.console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks

---
3. RDS Aurora Global Database fail-over to secondary region:
    **NOTE:** This step can only be performed once the secondary cluster has at least one available node. This likely means waiting at least for part of the RDS stack updates to occur.
**RDS Console us-east-1**: https://us-east-1.console.aws.amazon.com/rds/home?region=us-east-1#databases:
**RDS Console us-east-2**: https://us-east-2.console.aws.amazon.com/rds/home?region=us-east-2#databases:
    1. Perform RDS Global Database fail-over
        1. From the RDS console in the primary region, Select the Global Database object and Actions > Switch over or fail over global database
        2. Select 'Failover (allow data loss)'
        3. Select the 'New primary cluster' drop-box and pick the cluster name for the secondary region cluster. It should be the only option available to choose. 
        4. Type 'confirm' in the text box and select 'Confirm'
        **Note**: This operation can also be performed via the AWS CLI with the following command:
        ```
        aws rds failover-global-cluster \
            --global-cluster-identifier qa-coreservices-gc-v1 \
            --target-db-cluster-identifier arn:aws:rds:us-east-2:608031589233:cluster:qa-coreservices-cluster-us-east-2-v1 \
            --allow-data-loss
        ```
---
4. Wait for CloudFormation and RDS changes to finalize. Once the "MainControlStack" CloudFormation stack has an "UPDATE_COMPLETE" status proceed to next step. 
    **NOTE:** The CloudFormation deployment times range from 20-45 minutes. 
---
5. Verify the following AWS resources:
    1. Global Accelerator Listener shows "Traffic Dial" set to "100%" and a "Health Status" of "Healthy" for the secondary region.
        - https://us-west-2.console.aws.amazon.com/globalaccelerator/home?region=us-east-1#GlobalAcceleratorDashboard:
    2. ECS Cluster showing each service running a minimum of 1 task (Production will have a minimum of 2 tasks).
        - https://us-east-2.console.aws.amazon.com/ecs/v2/clusters?region=us-east-2
    3. RDS Databases console is showing the secondary region cluster as the primary Aurora cluster, and has an appropriate number of nodes to accommodate incoming requests. (QA = 2 nodes, Prod = 3-4)
        - https://us-east-2.console.aws.amazon.com/rds/home?region=us-east-2#databases
    4. ElastiCache console shows a Redis cache cluster present and "Status" of "Available"
        - https://us-east-2.console.aws.amazon.com/elasticache/home?region=us-east-2#/redis
---
6. Login to the Studio Application and begin verifying the application is behaving appropriately. 
    - https://app.qa.studiodesigner.io/#/Login
---

### Performing a 'Manual' Fail-over - WIP

**NOTE:** This section was originally intended to be a full list of necessary steps to perform the disaster recovery plan when clicking through the console. Further research has yielded to making this a script(likely python) that can be run locally (or via CloudShell) to perform the same actions. 

### Reverting back to the primary region - WIP

The same steps outlined in the main fail-over section, "Performing an 'Automated' Fail-over" will essentially be followed, reverting the actions previously performed.

---
1. Determine that the event precipitating the disaster have been corrected/mitigated. 
---
2. Change CloudFormation stack input parameters:
    1. Make the following changes to files and commit to source control :
        1. > *aws-infrastructure\StudioDesignerApp\AppServices\ControlStackInput\ENVIRONMENT-us-east-1-maincontrolstack-input.json*
            - **DisasterEvent**: 'Yes' -> 'No'
            - **EnableContainers**: 'No' -> 'Yes'
        2. > *aws-infrastructure\StudioDesignerApp\AppServices\ControlStackInput\ENVIRONMENT-us-east-2-maincontrolstack-input.json*
            - **DisasterEvent**: 'Yes' -> 'No'
            - **EnableContainers**: 'Yes' -> 'No'
        3. > *aws-infrastructure\StudioDesignerApp\AppServices\DependencyStackInput\ENVIRONMENT\VPC-input.json*
            - **DisasterEvent**: 'Yes' -> 'No'
        4. Once each of the three above files have been changed, AzDO pipelines will have created a new artifact for upload to AWS, but the actual push will need to be started and approved in the AzDO Releases console. 
        AzDO Releases: https://dev.azure.com/StudioDesigner/DevSecOps/_release?_a=releases&view=mine&definitionId=1
            1. Go to the latest release number
            2. Select the environment to deploy to > Deploy. 
            3. Once the deploy process has started, an Approve button will appear. Select Approve. 
            4. Wait for the S3 Push to complete. 
    2. If source control access is unavailable or CodePipeline is included in the outage, the stacks can be updated manually on the CloudFormation console. This process will need to be performed in each region respectively for all stacks requiring changed inputs. Please see Appendix B "CodePipeline and S3 Artifact Storage" for additional information regarding necessary prerequisite steps when updating CloudFormation stacks directly. 
        1. Select stack (i.e. QA-MainControlStack, QA-VPC, etc.)
        2. Update > "Use existing template" 
        3. Change appropriate inputs. 

    >**NOTE:** CICD status can be followed in the CodePipeline and CloudFormation consoles.

    >**CodePipeline:** 
    us-east-1: https://us-east-1.console.aws.amazon.com/codesuite/codepipeline/pipelines?region=us-east-1
    us-east-2: https://us-east-2.console.aws.amazon.com/codesuite/codepipeline/pipelines?region=us-east-2

    >**CloudFormation:**
    us-east-1: https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks
    us-east-2: https://us-east-2.console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks
---
3. RDS Aurora Global Database fail-over to back to primary region:
    1. Perform RDS Global Database fail-over
        1. From the RDS console in the secondary region, Select the Global Database object and Actions > Switch over or fail over global database
        2. Select 'Switchover'
        3. Select the 'New primary cluster' drop-box and pick the cluster name for the primary region cluster. It should be the only option available to choose. 
        4. Type 'confirm' in the text box and select 'Confirm'
        **Note**: This operation can also be performed via the AWS CLI with the following command:
        ```
        aws rds failover-global-cluster \
            --global-cluster-identifier qa-coreservices-gc-v1 \
            --target-db-cluster-identifier arn:aws:rds:us-east-1:608031589233:cluster:qa-coreservices-cluster-us-east-1-v1
        ```
---
4. Wait for CloudFormation and RDS changes to finalize. Once the "MainControlStack" CloudFormation stack has an "UPDATE_COMPLETE" status proceed to next step. 
    **NOTE:** The CloudFormation deployment times range from 20-45 minutes. 
---
5. Verify the following AWS resources:
    1. Global Accelerator Listener shows "Traffic Dial" set to "100%" and a "Health Status" of "Healthy" for the primary region.
        - https://us-west-2.console.aws.amazon.com/globalaccelerator/home?region=us-east-1#GlobalAcceleratorDashboard:
    2. ECS Cluster showing each service running a minimum of 1 task (Production will have a minimum of 2 tasks).
        - https://us-east-1.console.aws.amazon.com/ecs/v2/clusters?region=us-east-1
    3. RDS Databases console is showing the primary region cluster as the primary Aurora cluster, and has an appropriate number of nodes to accommodate incoming requests. (QA = 2 nodes, Prod = 3-4)
        - https://us-east-1.console.aws.amazon.com/rds/home?region=us-east-1#databases
---
6. Login to the Studio Application and begin verifying the application is behaving appropriately. 
    - https://app.qa.studiodesigner.io/#/Login
---

## SWOT Analysis
### Strengths
- *Mostly* automated.
- Well defined manual steps.
- Leverages AWS services and features meant for architecting multi-region applications.
---
### Weaknesses
- Not 100% automated.
- Monitoring does not inform of a disaster scenario or outage (no automatic notifications).
---
### Opportunities
- Increase automation where possible, up to and including execution of database region fail-over.
- Existing framework for moving to a true multi-region application by default. 
---
### Threats
- The primary region of use, us-east-1. This region has experienced the most outages of any AWS region, while also being the source control region of numerous 'Global' AWS services. US-East-1 is also the oldest AWS region and the most popular amongst AWS customers. 
- Not all AWS regions are created equal. While AWS attempts to maintain parity between regions, not all AWS services and features are available in every region. Selection of primary/secondary regions can be a limiting factor in when/where/how StudioDesigner can successfully operate and continue to grow. 
---

## Appendices
### Appendix A: 'aws-infrastructure' repository

AzDO Repo Link:
https://dev.azure.com/StudioDesigner/DevSecOps/_git/aws-infrastructure

The repository contains only one branch, 'main'. Commits to 'main' are built via an AzDO Pipeline and are deployed to the various environments via AzDO Releases. Releases require manual approval before being deployed, with Production approval requiring full re-authentication.

### Appendix B: CodePipeline and S3 Artifact storage

The infrastructure pipeline template that deploys the CodePipeline pipeline also includes several S3 buckets for storing artifacts. 

These buckets are:
1. (ACCOUNT_ID)-azure-devops-(REGION)
2. (ACCOUNT_ID)-codepipeline-artifactstore-(REGION)
3. (ACCOUNT_ID)-infrastructure-repository-(REGION)

The 'codepipe-artifactstore' and 'infrastructure-repository' buckets have lifecycle policies that purge the bucket's contents after a set time in order to prevent stale or leftover artifacts from being used or accumulating over time. The 'azure-devops' bucket does not purge itself, but instead has versioning enabled, so that the latest copy of the artifact uploaded by Azure Pipelines is always available, including past releases. Due to these lifecycle policies, a scenario is possible whereby the 'infrastructure-repository' bucket's contents have been purged and attempts to manually update CloudFormation stacks results in a deployment failure. This scenario occurs when the AWS CodePipeline pipeline has not executed (and thus unzipped the AzDO) in the past 7 days. 

Currently, there are two ways to resolve this scenario:
1. (Recommended) Manually unzip the contents of the latest copy of 'aws-infrastructure/aws-infrastructure.zip' found in the 'azure-devops' bucket into the 'infrastructure-repository' bucket. 
2. Go to the CodePipeline console > Select the 'ENV-infra-cd-pipeline' pipeline > Release change. 
    * This action will trigger a full pipeline execution using the most recent artifact and may delay performing a regional failover while CloudFormation checks for stacks updates. 

### Appendix C: AWS Failure Scenarios

## Document TO-DO List
- Create scoped down AWS SSO access roles for Disaster Recovery Operators.
- Create 'manual' failover script, including deployment and reversion instructions.
- Screenshots where applicable. 