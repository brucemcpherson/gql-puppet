## references local cloudbuild.yaml and Dockerfile
SECRET=cloud-run-config
NAME=gql-puppet-run
REPO=cloud-run
IMAGE=gql
REGION=$(gcloud config get-value run/region)
SERVICE=gql-puppet

SA=$(gcloud iam service-accounts list | grep ${NAME} | awk '{print $2}')

# enable cloud run - as we can't reponsd topromptin cloudbuild script
# doesnt matter if it's already enabled 
gcloud services enable run.googleapis.com

gcloud builds submit \
  --region=${REGION} \
  --substitutions=_REPO=${REPO},_IMAGE=${IMAGE},_SECRET=${SECRET},_SA=${SA},_SERVICE=${SERVICE}

## we also want to set it to allow unauthenticated for now
 gcloud run services add-iam-policy-binding  ${SERVICE}\
    --member="allUsers" \
    --role="roles/run.invoker"