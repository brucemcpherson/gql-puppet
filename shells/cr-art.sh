# create an artifact registry repo

# use current project ID etc
PROJECTID=$(gcloud config get-value project)
REGION=$(gcloud config get-value run/region)
DESCRIPTION="Image repo for gql-puppet"
REPO="cloud-run"
FORMAT="docker"

echo "...creating ${FORMAT} repo ${REPO} in ${PROJECTID}:${REGION}"

gcloud artifacts repositories create ${REPO} \
  --repository-format=${FORMAT} \
  --location=${REGION} \
  --description="${DESCRIPTION}" \
  --project=${PROJECTID}