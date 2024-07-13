# create project
# in this organization
ORG=mcpher.com
PROJECTID=gql-puppet-zero
REGION=europe-west2

# the billing account name to charge this project to
ACCOUNT="My Billing Account"

# get the billing account id
ACCOUNTID=$(gcloud billing accounts list | grep "${ACCOUNT}"  | awk '{print $1}')
if [ -z $ACCOUNTID ]; then
  echo "No billing acount found"
  exit 1
fi

# get the organization id
ORGID=$(gcloud organizations list | grep ${ORG} | awk '{print $2}')
if [ -z $ORGID ]; then
  echo "No gcp organization found"
  exit 1
fi
echo "...locating ${PROJECTID} in organization ${ORG}:${ORGID}"

## create the project
gcloud projects create ${PROJECTID} --organization=${ORGID} --set-as-default

## link it to the billing account
echo "...linking ${PROJECTID} to billing account ${ACCOUNT}: ${ACCOUNTID}"
gcloud billing projects link ${PROJECTID} --billing-account "${ACCOUNTID}"

## where cloud run will run from
gcloud config set run/region ${REGION}
gcloud config list