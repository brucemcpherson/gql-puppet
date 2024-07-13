# create service account for the current project
ROLE=roles/secretmanager.secretAccessor
PROJECTID=$(gcloud config get-value project)
NAME=gql-puppet-run
DESCRIPTION="minimal SA to run gql-puppet on Cloud Run"

echo "...creating service account ${NAME} on project ${PROJECTID}"
gcloud iam service-accounts create ${NAME} \
  --description "${DESCRIPTION}" \
  --display-name "${NAME}"

# get the SA
SA=$(gcloud iam service-accounts list | grep ${NAME} | awk '{print $2}')
echo "...created ${SA}"

# assign required roles
gcloud projects add-iam-policy-binding ${PROJECTID} \
  --member=serviceAccount:${SA} \
  --role=${ROLE}

# summarize
gcloud projects get-iam-policy ${PROJECTID} \
    --flatten="bindings[].members" \
    --format='table(bindings.role)' \
    --filter="bindings.members:${SA}"

