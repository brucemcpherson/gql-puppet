# use current project ID
PROJECTID=$(gcloud config get-value project)

# your temporary json file
TEMPFILE=delete-me-soon.json

# the secret name
SECRET=cloud-run-config

echo "...creating ${SECRET} in project ${PROJECTID} from ${TEMPFILE}"

# create the secret
gcloud secrets create ${SECRET} \
  --data-file=${TEMPFILE} 

# show the current secret value
gcloud secrets versions access latest --secret=${SECRET} 

echo "...if it all went well go delete ${TEMPFILE} now"